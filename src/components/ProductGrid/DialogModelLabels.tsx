"use client";

import { useMemo, useState } from "react";
import { Loader2, Tag } from "lucide-react";
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
import { ModelVariation } from "@/interfaces/products.interface";
import { useModelVariations } from "@/hooks/useProductGrid";
import { GenerateLabel } from "@/service/label.service";
import { getApiErrorMessage } from "@/utils/apiError";
import { GridMatrix } from "./GridMatrix";
import { cellKey, gridAxes } from "./grid";

interface DialogModelLabelsProps {
  /** null fecha o diálogo */
  modelName: string | null;
  onOpenChange: (open: boolean) => void;
}

const MAX_LABELS = 5000;

/** Etiquetas do modelo inteiro: quantas imprimir de cada variação */
export function DialogModelLabels({ modelName, onOpenChange }: DialogModelLabelsProps) {
  const { data: variations, isLoading } = useModelVariations(modelName);

  return (
    <Dialog open={!!modelName} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Tag className="h-5 w-5 text-primary" />
            Etiquetas de {modelName}
          </DialogTitle>
          <DialogDescription>
            Já vem preenchido com uma etiqueta por peça em estoque. Cada etiqueta
            mostra o modelo, a cor e o tamanho.
          </DialogDescription>
        </DialogHeader>

        {isLoading || !variations ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <LabelsForm
            key={variations.map((v) => v.id).join()}
            variations={variations}
            onDone={() => onOpenChange(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

function LabelsForm({ variations, onDone }: { variations: ModelVariation[]; onDone: () => void }) {
  const { colors, sizes, byKey } = useMemo(() => gridAxes(variations), [variations]);

  const fill = (fn: (v: ModelVariation) => number) =>
    Object.fromEntries(variations.map((v) => [cellKey(v.color, v.size), fn(v)]));

  const [copies, setCopies] = useState<Record<string, number>>(() => fill((v) => Math.max(0, v.quantity)));
  const [generating, setGenerating] = useState(false);

  const total = Object.values(copies).reduce((s, q) => s + q, 0);

  const generate = async () => {
    if (!total || total > MAX_LABELS) return;
    setGenerating(true);
    try {
      await GenerateLabel(
        variations
          .map((v) => ({ product_id: v.id, quantity: copies[cellKey(v.color, v.size)] || 0 }))
          .filter((i) => i.quantity > 0),
      );
      toast.success(`${total} ${total === 1 ? "etiqueta gerada" : "etiquetas geradas"}.`);
      onDone();
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Erro ao gerar etiquetas."));
    } finally {
      setGenerating(false);
    }
  };

  const preset = "cursor-pointer rounded-full border border-border px-2.5 py-0.5 text-xs text-muted-foreground hover:bg-muted hover:text-foreground";

  return (
    <>
      <div className="flex flex-wrap gap-1.5">
        <button type="button" className={preset} onClick={() => setCopies(fill((v) => Math.max(0, v.quantity)))}>
          Uma por peça em estoque
        </button>
        <button type="button" className={preset} onClick={() => setCopies(fill(() => 1))}>
          Uma de cada variação
        </button>
        <button type="button" className={preset} onClick={() => setCopies({})}>
          Zerar
        </button>
      </div>

      <GridMatrix
        colors={colors}
        sizes={sizes}
        quantities={copies}
        onChange={(key, qty) => setCopies((c) => ({ ...c, [key]: qty }))}
        isAvailable={(color, size) => byKey.has(cellKey(color, size))}
        hint={(color, size) => {
          const v = byKey.get(cellKey(color, size));
          return v ? `est. ${v.quantity}` : undefined;
        }}
      />

      {total > MAX_LABELS && (
        <p className="text-xs text-rose-600 dark:text-rose-400">
          No máximo {MAX_LABELS.toLocaleString("pt-BR")} etiquetas por vez.
        </p>
      )}

      <DialogFooter className="items-center gap-3 sm:justify-between">
        <p className="text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">{total}</span>{" "}
          {total === 1 ? "etiqueta" : "etiquetas"} · {Math.ceil(total / 65)}{" "}
          {Math.ceil(total / 65) === 1 ? "folha" : "folhas"} A4
        </p>
        <div className="flex gap-2">
          <Button type="button" variant="outline" onClick={onDone} className="cursor-pointer">
            Cancelar
          </Button>
          <Button
            type="button"
            onClick={generate}
            disabled={!total || total > MAX_LABELS || generating}
            className="cursor-pointer"
          >
            {generating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Tag className="h-4 w-4" />}
            Gerar PDF
          </Button>
        </div>
      </DialogFooter>
    </>
  );
}
