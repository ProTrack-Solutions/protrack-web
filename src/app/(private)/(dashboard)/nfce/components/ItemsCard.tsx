"use client";

import { Dispatch, SetStateAction } from "react";
import { Package, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { brl } from "@/components/DashCard";
import { useTaxProfiles } from "@/hooks/useFiscal";
import { Product } from "@/interfaces/products.interface";
import { ManualPreview } from "@/interfaces/fiscal.interface";
import { ProductSearch } from "./Pickers";
import { Section } from "./Section";
import { digits, FormState, isNfe, ItemRow, lineTotal, newKey } from "./manual-form";

const PRODUCT_PROFILE = "__product__";

export function ItemsCard({
  form,
  setForm,
  preview,
}: {
  form: FormState;
  setForm: Dispatch<SetStateAction<FormState>>;
  preview?: ManualPreview;
}) {
  // Perfis exigem o módulo de estoque: sem acesso, o item usa o perfil do produto
  const { data: profiles, isError } = useTaxProfiles();
  const showProfiles = !isError && (profiles?.length ?? 0) > 0;
  const nfe = isNfe(form);

  const setItem = (key: string, patch: Partial<ItemRow>) =>
    setForm((f) => ({
      ...f,
      items: f.items.map((it) => (it.key === key ? { ...it, ...patch } : it)),
    }));

  const add = (p: Product) =>
    setForm((f) => ({
      ...f,
      items: [
        ...f.items,
        {
          key: newKey(),
          product_id: p.id,
          product_name: p.name.slice(0, 120),
          unit: p.unit || "UN",
          description: p.name.slice(0, 120),
          quantity: "1",
          unit_price: String(p.sale_price ?? 0).replace(".", ","),
          discount: "",
          cfop: "",
          tax_profile_id: "",
        },
      ],
    }));

  const remove = (key: string) =>
    setForm((f) => ({ ...f, items: f.items.filter((it) => it.key !== key) }));

  return (
    <Section
      icon={<Package className="h-4 w-4" />}
      title="Produtos"
      description="NCM, unidade e origem vêm do cadastro. Ajuste descrição, quantidade, preço e desconto aqui"
      action={<ProductSearch onSelect={add} />}
    >
      {form.items.length === 0 ? (
        <p className="py-6 text-center text-sm text-muted-foreground">
          Nenhum produto na nota. Use &quot;Adicionar produto&quot;.
        </p>
      ) : (
        <div className="space-y-3">
          {form.items.map((it, i) => {
            const resolvedCfop = preview?.items[i]?.cfop;
            return (
              <div key={it.key} className="rounded-xl border border-border/70 p-3">
                <div className="flex items-start gap-2">
                  <span className="mt-2 w-5 shrink-0 text-xs font-semibold text-muted-foreground tabular-nums">
                    {i + 1}
                  </span>
                  <div className="grid min-w-0 flex-1 gap-3">
                    <Input
                      aria-label={`Descrição do item ${i + 1}`}
                      value={it.description}
                      maxLength={120}
                      onChange={(e) => setItem(it.key, { description: e.target.value })}
                    />
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                      <label className="space-y-1 text-xs text-muted-foreground">
                        Quantidade ({it.unit})
                        <Input
                          inputMode="decimal"
                          value={it.quantity}
                          onChange={(e) => setItem(it.key, { quantity: e.target.value })}
                        />
                      </label>
                      <label className="space-y-1 text-xs text-muted-foreground">
                        Preço unitário
                        <Input
                          inputMode="decimal"
                          value={it.unit_price}
                          onChange={(e) => setItem(it.key, { unit_price: e.target.value })}
                        />
                      </label>
                      <label className="space-y-1 text-xs text-muted-foreground">
                        Desconto (R$)
                        <Input
                          inputMode="decimal"
                          value={it.discount}
                          placeholder="0,00"
                          onChange={(e) => setItem(it.key, { discount: e.target.value })}
                        />
                      </label>
                      <label className="space-y-1 text-xs text-muted-foreground">
                        CFOP
                        <Input
                          inputMode="numeric"
                          value={it.cfop}
                          placeholder={resolvedCfop ? `${resolvedCfop} (auto)` : "automático"}
                          onChange={(e) => setItem(it.key, { cfop: digits(e.target.value).slice(0, 4) })}
                        />
                      </label>
                    </div>
                    {showProfiles && (
                      <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
                        <label className="space-y-1 text-xs text-muted-foreground">
                          Perfil tributário
                          <Select
                            value={it.tax_profile_id || PRODUCT_PROFILE}
                            onValueChange={(v) =>
                              setItem(it.key, { tax_profile_id: v === PRODUCT_PROFILE ? "" : v })
                            }
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value={PRODUCT_PROFILE}>Do cadastro do produto</SelectItem>
                              {profiles!.map((p) => (
                                <SelectItem key={p.id} value={p.id}>
                                  {p.name} · CFOP {p.cfop}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </label>
                      </div>
                    )}
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      aria-label={`Remover item ${i + 1}`}
                      onClick={() => remove(it.key)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <span className="text-sm font-semibold tabular-nums">{brl(lineTotal(it))}</span>
                  </div>
                </div>
              </div>
            );
          })}
          {nfe && (
            <p className="text-xs text-muted-foreground">
              CFOP em branco usa o da natureza da operação ou o do perfil. Para outro estado o
              5 vira 6 automaticamente.
            </p>
          )}
        </div>
      )}
    </Section>
  );
}
