"use client";

import { useMemo, useState } from "react";
import { ArrowDownUp, Loader2, Minus, PackagePlus, Plus, Save, SlidersHorizontal } from "lucide-react";
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ModelVariation, StockMovementType } from "@/interfaces/products.interface";
import { CreateGridStockMovement } from "@/service/products.service";
import { useInvalidateGrid, useModelVariations } from "@/hooks/useProductGrid";
import { getApiErrorMessage } from "@/utils/apiError";
import { GridMatrix } from "./GridMatrix";
import { cellKey, gridAxes } from "./grid";

interface DialogModelStockProps {
  /** null fecha o diálogo */
  modelName: string | null;
  onOpenChange: (open: boolean) => void;
}

/** Entrada ou ajuste de estoque de várias variações do modelo de uma vez */
export function DialogModelStock({ modelName, onOpenChange }: DialogModelStockProps) {
  const { data: variations, isLoading } = useModelVariations(modelName);

  return (
    <Dialog open={!!modelName} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ArrowDownUp className="h-5 w-5 text-primary" />
            Movimentar estoque pela grade
          </DialogTitle>
          <DialogDescription>{modelName}</DialogDescription>
        </DialogHeader>

        {isLoading || !variations ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <StockForm
            key={variations.map((v) => v.id).join()}
            modelName={modelName!}
            variations={variations}
            onDone={() => onOpenChange(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

function StockForm({
  modelName,
  variations,
  onDone,
}: {
  modelName: string;
  variations: ModelVariation[];
  onDone: () => void;
}) {
  const invalidate = useInvalidateGrid();
  const { colors, sizes, byKey } = useMemo(() => gridAxes(variations), [variations]);

  const [type, setType] = useState<StockMovementType>("ENTRY");
  const [direction, setDirection] = useState<"increase" | "decrease">("decrease");
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const sign = type === "ADJUSTMENT" && direction === "decrease" ? -1 : 1;
  const pieces = Object.values(quantities).reduce((s, q) => s + q, 0);

  const overdrawn = (color: string, size: string) => {
    const v = byKey.get(cellKey(color, size));
    return !!v && sign < 0 && (quantities[cellKey(color, size)] || 0) > v.quantity;
  };
  const anyOverdrawn = variations.some((v) => overdrawn(v.color, v.size));

  const reasonRequired = type === "ADJUSTMENT";
  const canSubmit =
    pieces > 0 && !anyOverdrawn && (!reasonRequired || reason.trim() !== "") && !submitting;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setSubmitting(true);
    try {
      const items = variations
        .map((v) => ({ product_id: v.id, quantity: sign * (quantities[cellKey(v.color, v.size)] || 0) }))
        .filter((i) => i.quantity !== 0);
      await CreateGridStockMovement(modelName, {
        type,
        reason: reason.trim() || undefined,
        items,
      });
      toast.success(
        `${type === "ENTRY" ? "Entrada" : "Ajuste"} de ${pieces} ${pieces === 1 ? "peça" : "peças"} em ${items.length} ${items.length === 1 ? "variação" : "variações"}.`,
      );
      invalidate();
      onDone();
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Erro ao registrar a movimentação."));
    } finally {
      setSubmitting(false);
    }
  };

  const typeOptions = [
    { value: "ENTRY" as const, label: "Entrada", description: "Reposição ou compra de mercadoria", icon: PackagePlus },
    { value: "ADJUSTMENT" as const, label: "Ajuste", description: "Inventário, perda ou avaria", icon: SlidersHorizontal },
  ];

  return (
    <form onSubmit={submit} className="space-y-5">
      <div className="grid grid-cols-2 gap-3">
        {typeOptions.map((option) => {
          const Icon = option.icon;
          const selected = type === option.value;
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => setType(option.value)}
              className={`cursor-pointer rounded-lg border p-3 text-left transition-colors ${
                selected ? "border-blue-500 bg-blue-50 dark:bg-blue-500/10" : "border-border hover:bg-muted/50"
              }`}
            >
              <div className="flex items-center gap-2">
                <Icon className={`h-4 w-4 ${selected ? "text-blue-600 dark:text-blue-400" : "text-muted-foreground"}`} />
                <span className="text-sm font-semibold">{option.label}</span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">{option.description}</p>
            </button>
          );
        })}
      </div>

      {type === "ADJUSTMENT" && (
        <div className="grid grid-cols-2 gap-3">
          <Button
            type="button"
            variant={direction === "decrease" ? "default" : "outline"}
            onClick={() => setDirection("decrease")}
            className="h-10 cursor-pointer"
          >
            <Minus className="mr-1 h-4 w-4" />
            Reduzir
          </Button>
          <Button
            type="button"
            variant={direction === "increase" ? "default" : "outline"}
            onClick={() => setDirection("increase")}
            className="h-10 cursor-pointer"
          >
            <Plus className="mr-1 h-4 w-4" />
            Aumentar
          </Button>
        </div>
      )}

      <div className="space-y-2">
        <Label className="text-sm font-medium">
          {sign < 0 ? "Quanto sai de cada variação" : "Quanto entra em cada variação"}
        </Label>
        <GridMatrix
          colors={colors}
          sizes={sizes}
          quantities={quantities}
          onChange={(key, qty) => setQuantities((q) => ({ ...q, [key]: qty }))}
          isAvailable={(color, size) => byKey.has(cellKey(color, size))}
          isInvalid={overdrawn}
          hint={(color, size) => {
            const v = byKey.get(cellKey(color, size));
            if (!v) return undefined;
            const q = quantities[cellKey(color, size)] || 0;
            return q ? `${v.quantity} → ${v.quantity + sign * q}` : `est. ${v.quantity}`;
          }}
        />
        {anyOverdrawn && (
          <p className="text-xs text-rose-600 dark:text-rose-400">
            O estoque de uma variação não pode ficar negativo.
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="grid-stock-reason" className="text-sm font-medium">
          Motivo{" "}
          {reasonRequired ? (
            <span className="text-rose-500">*</span>
          ) : (
            <span className="text-muted-foreground">(opcional)</span>
          )}
        </Label>
        <Textarea
          id="grid-stock-reason"
          placeholder={type === "ENTRY" ? "Ex: Compra do fornecedor, NF 1234" : "Ex: Contagem de inventário"}
          value={reason}
          maxLength={500}
          onChange={(e) => setReason(e.target.value)}
          className="min-h-16 resize-none"
        />
      </div>

      <DialogFooter className="items-center gap-3 sm:justify-between">
        <p className="text-sm text-muted-foreground">
          <span
            className={`font-semibold ${
              pieces === 0
                ? "text-foreground"
                : sign > 0
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-rose-600 dark:text-rose-400"
            }`}
          >
            {pieces === 0 ? 0 : `${sign > 0 ? "+" : "−"}${pieces}`}
          </span>{" "}
          {pieces === 1 ? "peça" : "peças"}
        </p>
        <div className="flex gap-2">
          <Button type="button" variant="outline" onClick={onDone} className="cursor-pointer">
            Cancelar
          </Button>
          <Button type="submit" disabled={!canSubmit} className="cursor-pointer">
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Registrar
          </Button>
        </div>
      </DialogFooter>
    </form>
  );
}
