"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { Loader2, Receipt } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ORIGIN_LABEL,
  ProductFiscal,
  ProductFiscalParams,
  UnitOfMeasure,
} from "@/interfaces/fiscal.interface";
import {
  FISCAL_KEY,
  useInvalidateFiscal,
  useTaxProfiles,
} from "@/hooks/useFiscal";
import { useModelVariations } from "@/hooks/useProductGrid";
import {
  GetProductFiscal,
  UpdateModelFiscal,
  UpdateProductFiscal,
} from "@/service/fiscal.service";
import { getApiErrorMessage } from "@/utils/apiError";

export type FiscalTarget =
  | { kind: "product"; productId: string; name: string }
  | { kind: "model"; modelName: string };

const INHERIT = "__inherit__";
const UNITS: UnitOfMeasure[] = ["UN", "KG", "G", "L", "ML"];

/** NCM no formato 0000.00.00 enquanto digita */
export const maskNCM = (v: string) => {
  const d = v.replace(/\D/g, "").slice(0, 8);
  return d
    .replace(/^(\d{4})(\d)/, "$1.$2")
    .replace(/^(\d{4})\.(\d{2})(\d)/, "$1.$2.$3");
};

interface Props {
  target: FiscalTarget | null;
  onOpenChange: (open: boolean) => void;
}

/** NCM, CEST, unidade, origem e perfil tributário do produto (ou do modelo inteiro) */
export function DialogProductFiscal({ target, onOpenChange }: Props) {
  const modelName = target?.kind === "model" ? target.modelName : null;
  const { data: variations, isLoading: loadingVariations } =
    useModelVariations(modelName);
  // Modelo: os dados fiscais são iguais em todas as variações; lê a primeira
  const productId =
    target?.kind === "product"
      ? target.productId
      : (variations?.[0]?.id ?? null);
  const { data: current, isLoading } = useQuery({
    queryKey: [FISCAL_KEY, "product", productId],
    queryFn: () => GetProductFiscal(productId!),
    enabled: !!productId,
  });

  const title =
    target?.kind === "model" ? target.modelName : (target?.name ?? "");
  const loading = isLoading || (target?.kind === "model" && loadingVariations);

  return (
    <Dialog open={!!target} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5" /> Dados fiscais
          </DialogTitle>
          <DialogDescription>
            {target?.kind === "model"
              ? `Vale para todas as ${variations?.length ?? ""} variações do modelo "${title}".`
              : `Como "${title}" sai na NFC-e.`}
          </DialogDescription>
        </DialogHeader>
        {loading || !current ? (
          <div className="flex justify-center p-6">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <FiscalForm
            key={current.product_id}
            target={target!}
            current={current}
            onDone={() => onOpenChange(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

function FiscalForm({
  target,
  current,
  onDone,
}: {
  target: FiscalTarget;
  current: ProductFiscal;
  onDone: () => void;
}) {
  const invalidate = useInvalidateFiscal();
  const { data: profiles = [] } = useTaxProfiles();
  const [form, setForm] = useState<ProductFiscalParams>({
    ncm: maskNCM(current.ncm ?? ""),
    cest: current.cest ?? "",
    unit: current.unit,
    origin: current.origin,
    tax_profile_id: current.tax_profile_id,
  });
  const [saving, setSaving] = useState(false);
  const set = (patch: Partial<ProductFiscalParams>) =>
    setForm((f) => ({ ...f, ...patch }));

  const inherited =
    profiles.find((p) => p.id === current.category_tax_profile_id) ??
    profiles.find((p) => p.is_default);
  const ncmDigits = form.ncm.replace(/\D/g, "");
  const ncmOk = ncmDigits.length === 0 || ncmDigits.length === 8;

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const n =
        target.kind === "model"
          ? await UpdateModelFiscal(target.modelName, form)
          : await UpdateProductFiscal(target.productId, form);
      toast.success(
        target.kind === "model"
          ? `Dados fiscais gravados em ${n} ${n === 1 ? "variação" : "variações"}.`
          : "Dados fiscais gravados.",
      );
      invalidate();
      onDone();
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Erro ao salvar os dados fiscais"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={save} className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="pf-ncm">NCM</Label>
          <Input
            id="pf-ncm"
            inputMode="numeric"
            value={form.ncm}
            onChange={(e) => set({ ncm: maskNCM(e.target.value) })}
            placeholder="0000.00.00"
            aria-invalid={!ncmOk}
          />
          <p
            className={`text-xs ${ncmOk ? "text-muted-foreground" : "text-destructive"}`}
          >
            {ncmOk ? "Obrigatório para sair na nota" : "O NCM tem 8 dígitos"}
          </p>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="pf-cest">CEST</Label>
          <Input
            id="pf-cest"
            inputMode="numeric"
            value={form.cest}
            onChange={(e) =>
              set({ cest: e.target.value.replace(/\D/g, "").slice(0, 7) })
            }
            placeholder="Só se houver ST"
          />
        </div>
        <div className="space-y-1.5">
          <Label>Unidade</Label>
          <Select
            value={form.unit}
            onValueChange={(v) => set({ unit: v as UnitOfMeasure })}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {UNITS.map((u) => (
                <SelectItem key={u} value={u}>
                  {u}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label>Origem da mercadoria</Label>
          <Select
            value={String(form.origin)}
            onValueChange={(v) => set({ origin: Number(v) })}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(ORIGIN_LABEL).map(([k, label]) => (
                <SelectItem key={k} value={k}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-1.5">
        <Label>Perfil tributário</Label>
        <Select
          value={form.tax_profile_id ?? INHERIT}
          onValueChange={(v) =>
            set({ tax_profile_id: v === INHERIT ? null : v })
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={INHERIT}>
              {current.category_tax_profile_id
                ? "Igual ao da categoria"
                : "Padrão da empresa"}
              {inherited ? ` (${inherited.name})` : ""}
            </SelectItem>
            {profiles.map((p) => (
              <SelectItem key={p.id} value={p.id}>
                {p.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {profiles.length === 0 && (
          <p className="text-xs text-muted-foreground">
            Nenhum perfil cadastrado.{" "}
            <Link href="/config/fiscal" className="underline">
              Configurar a NFC-e
            </Link>
          </p>
        )}
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onDone}>
          Cancelar
        </Button>
        <Button type="submit" disabled={saving || !ncmOk}>
          {saving && <Loader2 className="h-4 w-4 animate-spin" />}
          Salvar
        </Button>
      </DialogFooter>
    </form>
  );
}
