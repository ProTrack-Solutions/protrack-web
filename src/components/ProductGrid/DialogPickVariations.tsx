"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Grid3x3, Layers, Loader2, Search, ShoppingCart } from "lucide-react";
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
import { ModelVariation, Product } from "@/interfaces/products.interface";
import { useModelVariations, useStockEntries } from "@/hooks/useProductGrid";
import { brl } from "@/components/DashCard";
import { GridMatrix } from "./GridMatrix";
import { cellKey, gridAxes } from "./grid";
import { variationToProduct } from "./toProduct";

export interface PickedVariation {
  product: Product;
  quantity: number;
}

interface DialogPickVariationsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Quanto de cada variação já está na venda (desconta do disponível) */
  inSale: Record<string, number>;
  onPick: (items: PickedVariation[]) => void;
}

function useDebounced<T>(value: T, delay: number) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

/** PDV: escolhe o modelo e marca, na grade, quantas peças de cada cor/tamanho */
export function DialogPickVariations({ open, onOpenChange, inSale, onPick }: DialogPickVariationsProps) {
  const [model, setModel] = useState<string | null>(null);

  const handleOpenChange = (next: boolean) => {
    if (!next) setModel(null);
    onOpenChange(next);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Grid3x3 className="h-5 w-5 text-primary" />
            {model ? model : "Adicionar pela grade"}
          </DialogTitle>
          <DialogDescription>
            {model
              ? "Informe quantas peças de cada cor e tamanho. Abaixo de cada campo aparece o disponível."
              : "Busque o modelo pelo nome, cor ou código."}
          </DialogDescription>
        </DialogHeader>

        {open &&
          (model ? (
            <PickGrid
              modelName={model}
              inSale={inSale}
              onBack={() => setModel(null)}
              onPick={(items) => {
                onPick(items);
                handleOpenChange(false);
              }}
            />
          ) : (
            <ModelSearch onSelect={setModel} />
          ))}
      </DialogContent>
    </Dialog>
  );
}

function ModelSearch({ onSelect }: { onSelect: (model: string) => void }) {
  const [text, setText] = useState("");
  const search = useDebounced(text.trim(), 300);
  const { data, isFetching } = useStockEntries({ Page: 1, PerPage: 30, Search: search, OrderBy: "desc" });
  const models = (data?.data ?? []).filter((e) => e.kind === "model");

  return (
    <div className="space-y-3">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          autoFocus
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Ex.: camiseta, polo azul..."
          className="h-10 pl-9"
        />
        {isFetching && (
          <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" />
        )}
      </div>

      <ul className="max-h-80 divide-y divide-border/60 overflow-y-auto rounded-xl border border-border">
        {models.map((m) => (
          <li key={m.key}>
            <button
              type="button"
              onClick={() => onSelect(m.model_name)}
              className="flex w-full cursor-pointer items-center gap-3 px-3 py-2.5 text-left hover:bg-muted/50"
            >
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                <Layers className="h-4 w-4" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate font-medium">{m.name}</span>
                <span className="block text-xs text-muted-foreground">
                  {m.variations} variações · {m.quantity} em estoque
                </span>
              </span>
              <span className="text-sm font-semibold tabular-nums">
                {m.min_sale_price === m.max_sale_price
                  ? brl(m.min_sale_price)
                  : `${brl(m.min_sale_price)} – ${brl(m.max_sale_price)}`}
              </span>
            </button>
          </li>
        ))}
        {!isFetching && models.length === 0 && (
          <li className="px-3 py-8 text-center text-sm text-muted-foreground">
            {search ? `Nenhum modelo com grade encontrado para “${search}”.` : "Nenhum modelo com grade cadastrado."}
          </li>
        )}
      </ul>
    </div>
  );
}

function PickGrid({
  modelName,
  inSale,
  onBack,
  onPick,
}: {
  modelName: string;
  inSale: Record<string, number>;
  onBack: () => void;
  onPick: (items: PickedVariation[]) => void;
}) {
  const { data: variations, isLoading } = useModelVariations(modelName);
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  const axes = useMemo(() => gridAxes<ModelVariation>(variations ?? []), [variations]);
  const available = (v: ModelVariation) => Math.max(0, v.quantity - (inSale[v.id] || 0));

  if (isLoading || !variations) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const picked = variations
    .map((v) => ({ v, quantity: quantities[cellKey(v.color, v.size)] || 0 }))
    .filter((p) => p.quantity > 0);
  const pieces = picked.reduce((s, p) => s + p.quantity, 0);
  const total = picked.reduce((s, p) => s + p.quantity * p.v.sale_price, 0);

  return (
    <>
      <GridMatrix
        colors={axes.colors}
        sizes={axes.sizes}
        quantities={quantities}
        onChange={(key, qty) => setQuantities((q) => ({ ...q, [key]: qty }))}
        isAvailable={(color, size) => {
          const v = axes.byKey.get(cellKey(color, size));
          return !!v && available(v) > 0;
        }}
        unavailableTitle="Sem estoque"
        max={(color, size) => {
          const v = axes.byKey.get(cellKey(color, size));
          return v ? available(v) : 0;
        }}
        hint={(color, size) => {
          const v = axes.byKey.get(cellKey(color, size));
          return v ? `disp. ${available(v)}` : undefined;
        }}
      />

      <DialogFooter className="items-center gap-3 sm:justify-between">
        <Button type="button" variant="ghost" onClick={onBack} className="cursor-pointer">
          <ArrowLeft className="h-4 w-4" />
          Outro modelo
        </Button>
        <div className="flex items-center gap-3">
          <p className="text-sm text-muted-foreground">
            {pieces} {pieces === 1 ? "peça" : "peças"} ·{" "}
            <span className="font-semibold text-foreground">{brl(total)}</span>
          </p>
          <Button
            type="button"
            disabled={pieces === 0}
            onClick={() => onPick(picked.map((p) => ({ product: variationToProduct(p.v), quantity: p.quantity })))}
            className="cursor-pointer"
          >
            <ShoppingCart className="h-4 w-4" />
            Adicionar à venda
          </Button>
        </div>
      </DialogFooter>
    </>
  );
}
