"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
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
  emptyTaxProfile,
  TaxProfile,
  TaxProfileParams,
  TaxRegime,
} from "@/interfaces/fiscal.interface";
import { CreateTaxProfile, UpdateTaxProfile } from "@/service/fiscal.service";
import { useInvalidateFiscal } from "@/hooks/useFiscal";
import { getApiErrorMessage } from "@/utils/apiError";

// Os mesmos códigos que a API fiscal aceita na NFC-e
const CSOSN_OPTIONS = [
  {
    value: "102",
    label: "102 – Tributada pelo Simples sem permissão de crédito",
  },
  {
    value: "103",
    label: "103 – Isenção do ICMS no Simples para faixa de receita",
  },
  { value: "300", label: "300 – Imune" },
  { value: "400", label: "400 – Não tributada pelo Simples" },
  {
    value: "500",
    label: "500 – ICMS cobrado antes por substituição tributária",
  },
  { value: "900", label: "900 – Outros" },
];

const CST_OPTIONS = [
  { value: "00", label: "00 – Tributada integralmente" },
  { value: "20", label: "20 – Com redução de base de cálculo" },
  { value: "40", label: "40 – Isenta" },
  { value: "41", label: "41 – Não tributada" },
  { value: "60", label: "60 – ICMS cobrado antes por substituição tributária" },
  { value: "90", label: "90 – Outras" },
];

const PIS_OPTIONS = [
  { value: "49", label: "49 – Outras operações de saída" },
  { value: "99", label: "99 – Outras operações" },
  { value: "04", label: "04 – Monofásica (revenda a alíquota zero)" },
  { value: "05", label: "05 – Substituição tributária" },
  { value: "06", label: "06 – Alíquota zero" },
  { value: "07", label: "07 – Isenta" },
  { value: "08", label: "08 – Sem incidência" },
  { value: "09", label: "09 – Suspensão" },
];

const withRate = (cst: string) => cst === "49" || cst === "99";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Edição; ausente cria */
  profile?: TaxProfile | null;
  taxRegime: TaxRegime | null;
  onSaved?: (profile: TaxProfile) => void;
}

const rateValue = (v: number | null) => (v === null ? "" : String(v));
const parseRate = (s: string) =>
  s.trim() === "" ? null : Number(s.replace(",", "."));

export function TaxProfileDialog({
  open,
  onOpenChange,
  profile,
  taxRegime,
  onSaved,
}: Props) {
  // Remonta o formulário a cada abertura (key no conteúdo)
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-2xl">
        {open && (
          <TaxProfileForm
            key={profile?.id ?? "new"}
            profile={profile}
            taxRegime={taxRegime}
            onCancel={() => onOpenChange(false)}
            onSaved={(p) => {
              onSaved?.(p);
              onOpenChange(false);
            }}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

function TaxProfileForm({
  profile,
  taxRegime,
  onCancel,
  onSaved,
}: {
  profile?: TaxProfile | null;
  taxRegime: TaxRegime | null;
  onCancel: () => void;
  onSaved: (p: TaxProfile) => void;
}) {
  const invalidate = useInvalidateFiscal();
  const simples = taxRegime ? taxRegime === "1" || taxRegime === "4" : null;
  const [form, setForm] = useState<TaxProfileParams>(() => {
    if (profile) {
      return (
        Object.keys(emptyTaxProfile) as (keyof TaxProfileParams)[]
      ).reduce(
        (acc, key) => ({ ...acc, [key]: profile[key] ?? emptyTaxProfile[key] }),
        { ...emptyTaxProfile },
      );
    }
    return simples === false
      ? { ...emptyTaxProfile, icms_cst: "00" }
      : { ...emptyTaxProfile, icms_csosn: "102" };
  });
  const [saving, setSaving] = useState(false);
  // Regime ainda não salvo: deixa escolher a família
  const usesCSOSN = simples ?? form.icms_csosn !== "";
  const set = (patch: Partial<TaxProfileParams>) =>
    setForm((f) => ({ ...f, ...patch }));

  const icms = usesCSOSN ? form.icms_csosn : form.icms_cst;
  const needsRate =
    (!usesCSOSN && ["00", "20", "90"].includes(icms)) ||
    (usesCSOSN && icms === "900");
  const needsReduction = !usesCSOSN && icms === "20";

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload: TaxProfileParams = {
        ...form,
        icms_csosn: usesCSOSN ? form.icms_csosn : "",
        icms_cst: usesCSOSN ? "" : form.icms_cst,
        pis_rate: withRate(form.pis_cst) ? form.pis_rate : null,
        cofins_rate: withRate(form.cofins_cst) ? form.cofins_rate : null,
      };
      const saved = profile
        ? await UpdateTaxProfile(profile.id, payload)
        : await CreateTaxProfile(payload);
      toast.success(
        profile ? "Perfil tributário atualizado." : "Perfil tributário criado.",
      );
      invalidate();
      onSaved(saved);
    } catch (error) {
      toast.error(
        getApiErrorMessage(error, "Erro ao salvar o perfil tributário"),
      );
    } finally {
      setSaving(false);
    }
  };

  const rateInput = (
    id: string,
    label: string,
    value: number | null,
    onChange: (v: number | null) => void,
    hint?: string,
  ) => (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <Input
          id={id}
          inputMode="decimal"
          value={rateValue(value)}
          onChange={(e) => onChange(parseRate(e.target.value))}
          placeholder="0"
          className="pr-7"
        />
        <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
          %
        </span>
      </div>
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );

  return (
    <form onSubmit={submit} className="space-y-5">
      <DialogHeader>
        <DialogTitle>
          {profile ? "Editar perfil tributário" : "Novo perfil tributário"}
        </DialogTitle>
        <DialogDescription>
          Como os produtos que usam este perfil saem na NFC-e. Confirme os
          códigos com o seu contador; a API fiscal calcula os valores a partir
          das alíquotas.
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-1.5">
        <Label htmlFor="tp-name">Nome</Label>
        <Input
          id="tp-name"
          value={form.name}
          onChange={(e) => set({ name: e.target.value })}
          placeholder="Ex.: Revenda – Simples Nacional"
          maxLength={80}
          required
        />
      </div>

      <section className="space-y-3 rounded-lg border p-4">
        <p className="text-sm font-semibold">ICMS</p>
        {simples === null && (
          <div className="flex gap-2 text-xs">
            <Button
              type="button"
              size="sm"
              variant={usesCSOSN ? "default" : "outline"}
              onClick={() => set({ icms_csosn: "102", icms_cst: "" })}
            >
              Simples Nacional / MEI (CSOSN)
            </Button>
            <Button
              type="button"
              size="sm"
              variant={!usesCSOSN ? "default" : "outline"}
              onClick={() => set({ icms_csosn: "", icms_cst: "00" })}
            >
              Regime Normal (CST)
            </Button>
          </div>
        )}
        <div className="grid gap-3 sm:grid-cols-[2fr_1fr]">
          <div className="space-y-1.5">
            <Label>{usesCSOSN ? "CSOSN" : "CST"}</Label>
            <Select
              value={icms}
              onValueChange={(v) =>
                usesCSOSN ? set({ icms_csosn: v }) : set({ icms_cst: v })
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Escolha" />
              </SelectTrigger>
              <SelectContent>
                {(usesCSOSN ? CSOSN_OPTIONS : CST_OPTIONS).map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="tp-cfop">CFOP</Label>
            <Input
              id="tp-cfop"
              value={form.cfop}
              onChange={(e) =>
                set({ cfop: e.target.value.replace(/\D/g, "").slice(0, 4) })
              }
              placeholder="5102"
            />
          </div>
        </div>
        {needsRate && (
          <div className="grid gap-3 sm:grid-cols-3">
            {rateInput(
              "tp-icms-rate",
              "Alíquota do ICMS",
              form.icms_rate,
              (v) => set({ icms_rate: v }),
              usesCSOSN || icms === "90" ? "Opcional" : undefined,
            )}
            {needsReduction &&
              rateInput(
                "tp-icms-red",
                "Redução da base",
                form.icms_base_reduction,
                (v) => set({ icms_base_reduction: v }),
              )}
            {!usesCSOSN &&
              rateInput(
                "tp-fcp",
                "FCP",
                form.icms_fcp_rate,
                (v) => set({ icms_fcp_rate: v }),
                "Opcional",
              )}
          </div>
        )}
        <div className="space-y-1.5">
          <Label htmlFor="tp-cbenef">Código de benefício fiscal (cBenef)</Label>
          <Input
            id="tp-cbenef"
            value={form.benefit_code}
            onChange={(e) =>
              set({ benefit_code: e.target.value.toUpperCase().slice(0, 10) })
            }
            placeholder="Opcional – ex.: MG800001"
          />
        </div>
      </section>

      <section className="grid gap-3 rounded-lg border p-4 sm:grid-cols-2">
        <p className="text-sm font-semibold sm:col-span-2">PIS e COFINS</p>
        {(["pis", "cofins"] as const).map((k) => {
          const cst = k === "pis" ? form.pis_cst : form.cofins_cst;
          const rate = k === "pis" ? form.pis_rate : form.cofins_rate;
          return (
            <div key={k} className="space-y-3">
              <div className="space-y-1.5">
                <Label>CST do {k.toUpperCase()}</Label>
                <Select
                  value={cst}
                  onValueChange={(v) =>
                    set(k === "pis" ? { pis_cst: v } : { cofins_cst: v })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PIS_OPTIONS.map((o) => (
                      <SelectItem key={o.value} value={o.value}>
                        {o.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {withRate(cst) &&
                rateInput(
                  `tp-${k}-rate`,
                  `Alíquota do ${k.toUpperCase()}`,
                  rate,
                  (v) =>
                    set(k === "pis" ? { pis_rate: v } : { cofins_rate: v }),
                  "Simples Nacional normalmente usa 0",
                )}
            </div>
          );
        })}
      </section>

      <section className="space-y-3 rounded-lg border p-4">
        <div>
          <p className="text-sm font-semibold">
            IBS e CBS (reforma tributária)
          </p>
          <p className="text-xs text-muted-foreground">
            Obrigatório em todo item. Sem alíquotas, vai só o CST e a
            classificação (cClassTrib).
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="tp-ibs-cst">CST do IBS/CBS</Label>
            <Input
              id="tp-ibs-cst"
              value={form.ibs_cbs_cst}
              onChange={(e) =>
                set({
                  ibs_cbs_cst: e.target.value.replace(/\D/g, "").slice(0, 3),
                })
              }
              placeholder="000"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="tp-class">cClassTrib</Label>
            <Input
              id="tp-class"
              value={form.ibs_cbs_class_code}
              onChange={(e) =>
                set({
                  ibs_cbs_class_code: e.target.value
                    .replace(/\D/g, "")
                    .slice(0, 6),
                })
              }
              placeholder="000001"
            />
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          {rateInput("tp-ibs-uf", "IBS estadual", form.ibs_state_rate, (v) =>
            set({ ibs_state_rate: v }),
          )}
          {rateInput("tp-ibs-mun", "IBS municipal", form.ibs_city_rate, (v) =>
            set({ ibs_city_rate: v }),
          )}
          {rateInput("tp-cbs", "CBS", form.cbs_rate, (v) =>
            set({ cbs_rate: v }),
          )}
        </div>
        <p className="text-xs text-muted-foreground">
          Preencha as três alíquotas ou deixe as três em branco.
        </p>
      </section>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={saving}>
          {saving && <Loader2 className="h-4 w-4 animate-spin" />}
          Salvar perfil
        </Button>
      </DialogFooter>
    </form>
  );
}
