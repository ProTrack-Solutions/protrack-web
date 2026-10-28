"use client";

import { useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { AlertTriangle, Loader2, Shirt } from "lucide-react";
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
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PURCHASES_KEY, useCatalogCategories } from "@/hooks/usePurchases";
import { CatalogProduct } from "@/interfaces/purchases.interface";
import { CreateProductVariations } from "@/service/purchases.service";
import { getApiErrorMessage } from "@/utils/apiError";
import { ChipInput } from "./ChipInput";
import { GridMatrix, cellKey } from "./GridMatrix";
import { margin, money, percent, round2 } from "./format";

export interface PickedItem {
  product: CatalogProduct;
  quantity: number;
  unitCost: number;
}

interface NewProductDialogProps {
  open: boolean;
  initialName: string;
  onOpenChange: (open: boolean) => void;
  onCreated: (items: PickedItem[]) => void;
}

const SIZE_PRESETS = [
  { label: "P M G GG", values: ["P", "M", "G", "GG"] },
  { label: "PP ao XG", values: ["PP", "P", "M", "G", "GG", "XG"] },
  { label: "34 ao 46", values: ["34", "36", "38", "40", "42", "44", "46"] },
  { label: "Infantil 2 ao 16", values: ["2", "4", "6", "8", "10", "12", "14", "16"] },
];

const VARIATION_SEPARATOR = " – ";

const variationLabel = (color: string, size: string) =>
  [color, size].filter(Boolean).join(VARIATION_SEPARATOR) || "Produto único";

/** Cadastro rápido do pedido: modelo + grade de cores e tamanhos */
export function NewProductDialog({
  open,
  initialName,
  onOpenChange,
  onCreated,
}: NewProductDialogProps) {
  const queryClient = useQueryClient();
  const { data: categories, isLoading: loadingCategories } = useCatalogCategories();

  const [modelName, setModelName] = useState(initialName);
  const [categoryId, setCategoryId] = useState("");
  const [costPrice, setCostPrice] = useState(0);
  const [salePrice, setSalePrice] = useState(0);
  const [sizes, setSizes] = useState<string[]>([]);
  const [colors, setColors] = useState<string[]>([]);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [customPrices, setCustomPrices] = useState(false);
  const [overrides, setOverrides] = useState<Record<string, { cost?: number; price?: number }>>({});
  const [submitting, setSubmitting] = useState(false);

  // Combinações com quantidade: só elas viram cadastro
  const combos = useMemo(() => {
    const rows = colors.length ? colors : [""];
    const cols = sizes.length ? sizes : [""];
    return rows
      .flatMap((color) => cols.map((size) => ({ color, size, key: cellKey(color, size) })))
      .filter((c) => (quantities[c.key] || 0) > 0);
  }, [colors, sizes, quantities]);

  const costOf = (key: string) => overrides[key]?.cost ?? costPrice;
  const priceOf = (key: string) => overrides[key]?.price ?? salePrice;

  const totalPieces = combos.reduce((s, c) => s + quantities[c.key], 0);
  const totalCost = round2(combos.reduce((s, c) => s + quantities[c.key] * costOf(c.key), 0));

  const errors = [
    modelName.trim().length < 2 && "Informe o nome do modelo.",
    !categoryId && "Escolha a categoria.",
    combos.length === 0 && "Informe a quantidade de ao menos uma variação.",
    combos.length > 100 && "No máximo 100 variações por cadastro.",
  ].filter(Boolean) as string[];

  const handleOpenChange = (next: boolean) => {
    if (submitting) return;
    onOpenChange(next);
  };

  const submit = async () => {
    if (errors.length || submitting) return;
    setSubmitting(true);
    try {
      const created = await CreateProductVariations({
        model_name: modelName.trim(),
        category_id: categoryId,
        cost_price: costPrice,
        sale_price: salePrice,
        variations: combos.map((c) => ({
          color: c.color,
          size: c.size,
          cost_price: overrides[c.key]?.cost,
          sale_price: overrides[c.key]?.price,
        })),
      });
      queryClient.invalidateQueries({ queryKey: [PURCHASES_KEY, "catalog"] });
      queryClient.invalidateQueries({ queryKey: ["products-stock"] });
      toast.success(
        created.length === 1
          ? `Produto "${created[0].name}" cadastrado.`
          : `${created.length} variações de "${modelName.trim()}" cadastradas.`,
      );
      // A API devolve na mesma ordem das combinações enviadas
      onCreated(
        created.map((product, i) => ({
          product,
          quantity: quantities[combos[i].key],
          unitCost: product.cost_price,
        })),
      );
      onOpenChange(false);
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Não foi possível cadastrar o produto."));
    } finally {
      setSubmitting(false);
    }
  };

  const moneyInput = (id: string, value: number, onChange: (v: number) => void, label: string) => (
    <Input
      id={id}
      type="number"
      min={0}
      step="0.01"
      inputMode="decimal"
      value={value || ""}
      placeholder="0,00"
      onChange={(e) => onChange(Math.max(0, Number(e.target.value) || 0))}
      aria-label={label}
      className="h-9 text-right"
    />
  );

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shirt className="h-5 w-5 text-blue-700 dark:text-blue-300" />
            Cadastrar produto novo
          </DialogTitle>
          <DialogDescription>
            Cada combinação de cor e tamanho vira um produto com código de barras
            próprio, sem estoque. O estoque entra quando a mercadoria for recebida.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          <section className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="model-name">
                Nome do modelo <span className="text-destructive">*</span>
              </Label>
              <Input
                id="model-name"
                value={modelName}
                maxLength={120}
                onChange={(e) => setModelName(e.target.value)}
                placeholder="Ex.: Camiseta Básica Gola V"
                autoFocus
                className="h-10"
              />
            </div>
            <div className="space-y-1.5">
              <Label>
                Categoria <span className="text-destructive">*</span>
              </Label>
              <Select value={categoryId} onValueChange={setCategoryId}>
                <SelectTrigger className="h-10 w-full">
                  <SelectValue placeholder={loadingCategories ? "Carregando..." : "Selecione"} />
                </SelectTrigger>
                <SelectContent>
                  {categories?.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {!loadingCategories && categories?.length === 0 && (
                <p className="text-xs text-muted-foreground">
                  Nenhuma categoria cadastrada. Peça para quem tem acesso ao Estoque criar uma.
                </p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="model-cost">Custo</Label>
                {moneyInput("model-cost", costPrice, setCostPrice, "Custo unitário")}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="model-price">Preço de venda</Label>
                {moneyInput("model-price", salePrice, setSalePrice, "Preço de venda")}
              </div>
              {salePrice > 0 && (
                <p className="col-span-2 -mt-1 text-right text-xs text-muted-foreground">
                  Margem {percent(margin(costPrice, salePrice))}
                </p>
              )}
            </div>
          </section>

          <section className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="sizes">Tamanhos</Label>
              <ChipInput
                id="sizes"
                values={sizes}
                onChange={setSizes}
                placeholder="Digite e tecle Enter"
                presets={SIZE_PRESETS}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="colors">Cores</Label>
              <ChipInput
                id="colors"
                values={colors}
                onChange={setColors}
                maxLength={50}
                placeholder="Ex.: Preta, Branca"
              />
            </div>
            <p className="text-xs text-muted-foreground sm:col-span-2">
              Sem tamanhos nem cores, é cadastrado um produto só. Combinações com
              quantidade zero não são criadas.
            </p>
          </section>

          <GridMatrix
            colors={colors}
            sizes={sizes}
            quantities={quantities}
            onChange={(key, qty) => setQuantities((q) => ({ ...q, [key]: qty }))}
          />

          {combos.length > 1 && (
            <section className="space-y-2">
              <div className="flex items-center justify-between gap-3">
                <Label htmlFor="custom-prices" className="text-sm">
                  Custo ou preço diferente em alguma variação
                </Label>
                <Switch id="custom-prices" checked={customPrices} onCheckedChange={setCustomPrices} />
              </div>
              {customPrices && (
                <ul className="max-h-56 space-y-1.5 overflow-y-auto rounded-xl border border-border p-2">
                  {combos.map((c) => (
                    <li key={c.key} className="grid grid-cols-[1fr_7rem_7rem] items-center gap-2 text-sm">
                      <span className="truncate">{variationLabel(c.color, c.size)}</span>
                      {moneyInput(`cost-${c.key}`, costOf(c.key), (v) => setOverrides((o) => ({ ...o, [c.key]: { ...o[c.key], cost: v } })), `Custo de ${variationLabel(c.color, c.size)}`)}
                      {moneyInput(`price-${c.key}`, priceOf(c.key), (v) => setOverrides((o) => ({ ...o, [c.key]: { ...o[c.key], price: v } })), `Preço de ${variationLabel(c.color, c.size)}`)}
                    </li>
                  ))}
                </ul>
              )}
            </section>
          )}

          {errors.length > 0 && (combos.length > 0 || modelName) && (
            <ul className="space-y-1 rounded-xl border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200">
              {errors.map((e) => (
                <li key={e} className="flex items-start gap-2">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                  {e}
                </li>
              ))}
            </ul>
          )}
        </div>

        <DialogFooter className="items-center gap-3 sm:justify-between">
          <p className="text-sm text-muted-foreground">
            {combos.length} {combos.length === 1 ? "produto" : "produtos"} · {totalPieces} peças ·{" "}
            <span className="font-semibold text-foreground">{money(totalCost)}</span>
          </p>
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={() => handleOpenChange(false)} disabled={submitting} className="cursor-pointer">
              Cancelar
            </Button>
            <Button type="button" onClick={submit} disabled={errors.length > 0 || submitting} className="cursor-pointer">
              {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
              Cadastrar e adicionar ao pedido
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
