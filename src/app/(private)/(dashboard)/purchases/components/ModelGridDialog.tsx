"use client";

import { useMemo, useState } from "react";
import { Grid3x3, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useModelVariations } from "@/hooks/usePurchases";
import { CatalogProduct } from "@/interfaces/purchases.interface";
import { GridMatrix, cellKey } from "./GridMatrix";
import { PickedItem } from "./NewProductDialog";
import { money, round2 } from "./format";

interface ModelGridDialogProps {
  modelName: string | null;
  /** Quantidade que cada produto já tem no pedido (preenche a grade) */
  currentQuantities: Record<string, number>;
  onOpenChange: (open: boolean) => void;
  /** Quantidade 0 remove a variação do pedido */
  onApply: (items: PickedItem[]) => void;
}

const unique = (values: string[]) =>
  values.filter((v, i) => values.findIndex((x) => x.toLowerCase() === v.toLowerCase()) === i);

/** Recompra: todas as variações de um modelo numa grade de quantidades */
export function ModelGridDialog({
  modelName,
  currentQuantities,
  onOpenChange,
  onApply,
}: ModelGridDialogProps) {
  const { data: variations, isLoading } = useModelVariations(modelName);

  return (
    <Dialog open={!!modelName} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Grid3x3 className="h-5 w-5 text-blue-700 dark:text-blue-300" />
            Grade de {modelName}
          </DialogTitle>
          <DialogDescription>
            Informe quanto pedir de cada variação. Abaixo de cada campo aparece o estoque atual.
          </DialogDescription>
        </DialogHeader>

        {isLoading || !variations ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          // Remonta quando as variações chegam, para o estado partir delas
          <GridForm
            key={variations.map((v) => v.id).join()}
            variations={variations}
            currentQuantities={currentQuantities}
            onCancel={() => onOpenChange(false)}
            onApply={(items) => {
              onApply(items);
              onOpenChange(false);
            }}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

function GridForm({
  variations,
  currentQuantities,
  onCancel,
  onApply,
}: {
  variations: CatalogProduct[];
  currentQuantities: Record<string, number>;
  onCancel: () => void;
  onApply: (items: PickedItem[]) => void;
}) {
  const byKey = useMemo(
    () => new Map(variations.map((v) => [cellKey(v.color, v.size), v])),
    [variations],
  );
  const colors = unique(variations.map((v) => v.color).filter(Boolean));
  const sizes = unique(variations.map((v) => v.size).filter(Boolean));

  const [quantities, setQuantities] = useState<Record<string, number>>(() =>
    Object.fromEntries(variations.map((v) => [cellKey(v.color, v.size), currentQuantities[v.id] || 0])),
  );

  const pieces = Object.values(quantities).reduce((s, q) => s + q, 0);
  const total = round2(
    variations.reduce((s, v) => s + (quantities[cellKey(v.color, v.size)] || 0) * v.cost_price, 0),
  );

  return (
    <>
      <GridMatrix
        colors={colors}
        sizes={sizes}
        quantities={quantities}
        onChange={(key, qty) => setQuantities((q) => ({ ...q, [key]: qty }))}
        isAvailable={(color, size) => byKey.has(cellKey(color, size))}
        hint={(color, size) => {
          const v = byKey.get(cellKey(color, size));
          return v && !v.sell_in_bulk ? `est. ${v.quantity}` : undefined;
        }}
      />
      <p className="text-xs text-muted-foreground">
        Falta alguma cor ou tamanho? Feche e use &quot;Cadastrar produto novo&quot; com o mesmo
        nome do modelo para criar só as variações novas.
      </p>
      <DialogFooter className="items-center gap-3 sm:justify-between">
        <p className="text-sm text-muted-foreground">
          {pieces} peças · <span className="font-semibold text-foreground">{money(total)}</span>
        </p>
        <div className="flex gap-2">
          <Button type="button" variant="outline" onClick={onCancel} className="cursor-pointer">
            Cancelar
          </Button>
          <Button
            type="button"
            className="cursor-pointer"
            onClick={() =>
              onApply(
                variations.map((product) => ({
                  product,
                  quantity: quantities[cellKey(product.color, product.size)] || 0,
                  unitCost: product.cost_price,
                })),
              )
            }
          >
            Aplicar ao pedido
          </Button>
        </div>
      </DialogFooter>
    </>
  );
}
