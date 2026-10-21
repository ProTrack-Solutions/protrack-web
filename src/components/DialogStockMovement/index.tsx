"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
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
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  ArrowDownUp,
  Minus,
  PackagePlus,
  Plus,
  Save,
  SlidersHorizontal,
} from "lucide-react";
import { toast } from "sonner";
import { Product, StockMovementType } from "@/interfaces/products.interface";
import { CreateStockMovement } from "@/service/products.service";
import { getApiErrorMessage } from "@/utils/apiError";

interface DialogStockMovementProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product;
}

type AdjustmentDirection = "increase" | "decrease";

const typeOptions: {
  value: StockMovementType;
  label: string;
  description: string;
  icon: typeof PackagePlus;
}[] = [
  {
    value: "ENTRY",
    label: "Entrada",
    description: "Reposição ou compra de mercadoria",
    icon: PackagePlus,
  },
  {
    value: "ADJUSTMENT",
    label: "Ajuste",
    description: "Correção de inventário, perda ou avaria",
    icon: SlidersHorizontal,
  },
];

export const DialogStockMovement = ({
  open,
  onOpenChange,
  product,
}: DialogStockMovementProps) => {
  const queryClient = useQueryClient();

  const [type, setType] = useState<StockMovementType>("ENTRY");
  const [direction, setDirection] = useState<AdjustmentDirection>("decrease");
  const [quantity, setQuantity] = useState(0);
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const currentQuantity = product.quantity ?? 0;
  // Na entrada a quantidade é sempre somada; no ajuste o usuário escolhe se aumenta ou reduz
  const delta =
    type === "ADJUSTMENT" && direction === "decrease" ? -quantity : quantity;
  const newQuantity = currentQuantity + delta;

  const reasonRequired = type === "ADJUSTMENT";
  const canSubmit =
    quantity > 0 &&
    newQuantity >= 0 &&
    (!reasonRequired || reason.trim() !== "") &&
    !submitting;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    try {
      setSubmitting(true);
      await CreateStockMovement(product.id, {
        type,
        quantity: delta,
        reason: reason.trim() || undefined,
      });
      toast.success(
        type === "ENTRY"
          ? "Entrada de estoque registrada!"
          : "Ajuste de estoque registrado!",
      );
      await queryClient.invalidateQueries({ queryKey: ["products-stock"] });
      onOpenChange(false);
    } catch (error) {
      console.log(error);
      toast.error(
        getApiErrorMessage(error, "Erro ao registrar movimentação de estoque!"),
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ArrowDownUp className="h-5 w-5 text-primary" />
            Movimentar estoque
          </DialogTitle>
          <DialogDescription>{product.name}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-2 gap-3">
            {typeOptions.map((option) => {
              const Icon = option.icon;
              const selected = type === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setType(option.value)}
                  className={`rounded-lg border p-3 text-left transition-colors cursor-pointer ${
                    selected
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-500/10"
                      : "border-border hover:bg-muted/50"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Icon
                      className={`w-4 h-4 ${selected ? "text-blue-600 dark:text-blue-400" : "text-muted-foreground"}`}
                    />
                    <span className="text-sm font-semibold">
                      {option.label}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {option.description}
                  </p>
                </button>
              );
            })}
          </div>

          {type === "ADJUSTMENT" && (
            <div className="space-y-2">
              <Label className="text-sm font-medium">Tipo de ajuste</Label>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  type="button"
                  variant={direction === "decrease" ? "default" : "outline"}
                  onClick={() => setDirection("decrease")}
                  className="h-10 cursor-pointer"
                >
                  <Minus className="w-4 h-4 mr-1" />
                  Reduzir
                </Button>
                <Button
                  type="button"
                  variant={direction === "increase" ? "default" : "outline"}
                  onClick={() => setDirection("increase")}
                  className="h-10 cursor-pointer"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Aumentar
                </Button>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="stock-movement-quantity" className="text-sm font-medium">
              Quantidade <span className="text-rose-500">*</span>
            </Label>
            <Input
              id="stock-movement-quantity"
              type="number"
              min="1"
              placeholder="0"
              value={quantity || ""}
              onChange={(e) =>
                setQuantity(Math.max(0, parseInt(e.target.value) || 0))
              }
              className="h-11"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="stock-movement-reason" className="text-sm font-medium">
              Motivo{" "}
              {reasonRequired ? (
                <span className="text-rose-500">*</span>
              ) : (
                <span className="text-muted-foreground">(opcional)</span>
              )}
            </Label>
            <Textarea
              id="stock-movement-reason"
              placeholder={
                type === "ENTRY"
                  ? "Ex: Compra do fornecedor, NF 1234"
                  : "Ex: Produto avariado, contagem de inventário"
              }
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="min-h-20 resize-none"
            />
          </div>

          <Separator />

          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-lg border border-border/60 bg-muted/30 p-3 text-center">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">
                Atual
              </p>
              <p className="text-lg font-bold text-foreground mt-1">
                {currentQuantity}
              </p>
            </div>
            <div className="rounded-lg border border-border/60 bg-muted/30 p-3 text-center">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">
                Movimentação
              </p>
              <p
                className={`text-lg font-bold mt-1 ${
                  delta > 0
                    ? "text-emerald-600 dark:text-emerald-400"
                    : delta < 0
                      ? "text-rose-600 dark:text-rose-400"
                      : "text-foreground"
                }`}
              >
                {delta > 0 ? `+${delta}` : delta}
              </p>
            </div>
            <div className="rounded-lg border border-blue-500/30 bg-blue-50 dark:bg-blue-500/10 p-3 text-center">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">
                Novo estoque
              </p>
              <p
                className={`text-lg font-bold mt-1 ${newQuantity < 0 ? "text-rose-600 dark:text-rose-400" : "text-foreground"}`}
              >
                {newQuantity}
              </p>
            </div>
          </div>

          {newQuantity < 0 && (
            <p className="text-xs text-rose-600 dark:text-rose-400">
              O estoque não pode ficar negativo.
            </p>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="h-11 cursor-pointer"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={!canSubmit}
              className="h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-sm cursor-pointer"
            >
              <Save className="w-4 h-4 mr-2" />
              {submitting ? "Salvando..." : "Registrar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
