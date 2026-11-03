"use client";

import { useState } from "react";
import { AlertTriangle, Layers, Loader2 } from "lucide-react";
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
import { GroupProductsIntoModel } from "@/service/products.service";
import { useInvalidateGrid } from "@/hooks/useProductGrid";
import { useProductsCategories } from "@/hooks/useProductsCategories";
import { getApiErrorMessage } from "@/utils/apiError";
import { cellKey, variationName } from "./grid";

/** O mínimo de cada produto que o agrupamento precisa */
export interface GroupableProduct {
  id: string;
  name: string;
  size: string;
  quantity: number;
  category_id: string;
}

interface DialogGroupProductsProps {
  open: boolean;
  products: GroupableProduct[];
  onOpenChange: (open: boolean) => void;
  onGrouped: () => void;
}

/** Prefixo comum dos nomes, cortado na última palavra inteira ("Polo Azul P", "Polo Azul M" → "Polo Azul") */
function commonPrefix(names: string[]) {
  if (!names.length) return "";
  let prefix = names[0];
  for (const n of names.slice(1)) {
    let i = 0;
    while (i < prefix.length && i < n.length && prefix[i].toLowerCase() === n[i].toLowerCase()) i++;
    prefix = prefix.slice(0, i);
  }
  if (names.length > 1 && !names.every((n) => n.length === prefix.length || /\s/.test(n[prefix.length] ?? " "))) {
    prefix = prefix.slice(0, prefix.lastIndexOf(" ") + 1);
  }
  return prefix.replace(/[\s\-–]+$/, "").trim();
}

/**
 * Transforma produtos soltos (cadastrados antes da grade) em variações de um
 * modelo. O produto continua o mesmo: saldo, histórico e vendas ficam.
 */
export function DialogGroupProducts({ open, products, onOpenChange, onGrouped }: DialogGroupProductsProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Layers className="h-5 w-5 text-primary" />
            Agrupar em modelo
          </DialogTitle>
          <DialogDescription>
            Os produtos continuam os mesmos (estoque, histórico e vendas ficam), mas
            passam a ser variações de um modelo, com o nome &quot;Modelo – Cor – Tamanho&quot;.
            Se já existir um modelo com esse nome, eles entram nele.
          </DialogDescription>
        </DialogHeader>
        {open && (
          <GroupForm
            products={products}
            onCancel={() => onOpenChange(false)}
            onDone={() => {
              onGrouped();
              onOpenChange(false);
            }}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

function GroupForm({
  products,
  onCancel,
  onDone,
}: {
  products: GroupableProduct[];
  onCancel: () => void;
  onDone: () => void;
}) {
  const invalidate = useInvalidateGrid();
  const { productsCategories } = useProductsCategories();

  const [modelName, setModelName] = useState(() => commonPrefix(products.map((p) => p.name)));
  const [categoryId, setCategoryId] = useState(products[0]?.category_id ?? "");
  const [rows, setRows] = useState<Record<string, { color: string; size: string }>>(() =>
    Object.fromEntries(products.map((p) => [p.id, { color: "", size: p.size ?? "" }])),
  );
  const [submitting, setSubmitting] = useState(false);

  const keys = products.map((p) => cellKey(rows[p.id].color, rows[p.id].size));
  const duplicated = new Set(keys.filter((k, i) => keys.indexOf(k) !== i));
  const empty = products.filter((p) => !rows[p.id].color.trim() && !rows[p.id].size.trim());

  const errors = [
    modelName.trim().length < 2 && "Informe o nome do modelo.",
    empty.length > 0 && "Informe a cor ou o tamanho de cada produto.",
    duplicated.size > 0 && "Dois produtos com a mesma cor e tamanho.",
  ].filter(Boolean) as string[];

  const submit = async () => {
    if (errors.length || submitting) return;
    setSubmitting(true);
    try {
      const variations = await GroupProductsIntoModel({
        model_name: modelName.trim(),
        category_id: categoryId || undefined,
        items: products.map((p) => ({
          product_id: p.id,
          color: rows[p.id].color.trim(),
          size: rows[p.id].size.trim(),
        })),
      });
      toast.success(
        `${products.length} ${products.length === 1 ? "produto agrupado" : "produtos agrupados"} em "${variations[0]?.model_name ?? modelName.trim()}".`,
      );
      invalidate();
      onDone();
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Não foi possível agrupar os produtos."));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-5">
      <section className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="group-model-name">
            Nome do modelo <span className="text-destructive">*</span>
          </Label>
          <Input
            id="group-model-name"
            value={modelName}
            maxLength={100}
            onChange={(e) => setModelName(e.target.value)}
            placeholder="Ex.: Camisa Polo Piquet"
            className="h-10"
            autoFocus
          />
        </div>
        <div className="space-y-1.5">
          <Label>Categoria do modelo</Label>
          <Select value={categoryId} onValueChange={setCategoryId}>
            <SelectTrigger className="h-10 w-full">
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              {productsCategories?.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            Num modelo que já existe, vale a categoria dele.
          </p>
        </div>
      </section>

      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full min-w-[560px] text-sm">
          <thead className="bg-muted/40 text-xs text-muted-foreground">
            <tr>
              <th className="px-3 py-2 text-left font-semibold">Produto atual</th>
              <th className="px-3 py-2 text-center font-semibold">Estoque</th>
              <th className="w-36 px-3 py-2 text-left font-semibold">Cor</th>
              <th className="w-28 px-3 py-2 text-left font-semibold">Tamanho</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {products.map((p) => {
              const row = rows[p.id];
              const bad = duplicated.has(cellKey(row.color, row.size));
              const set = (patch: Partial<typeof row>) => setRows((r) => ({ ...r, [p.id]: { ...r[p.id], ...patch } }));
              return (
                <tr key={p.id}>
                  <td className="px-3 py-1.5">
                    <p className="font-medium">{p.name}</p>
                    {modelName.trim() && (row.color.trim() || row.size.trim()) && (
                      <p className="text-xs text-muted-foreground">
                        → {variationName(modelName, row.color, row.size)}
                      </p>
                    )}
                  </td>
                  <td className="px-3 py-1.5 text-center tabular-nums">{p.quantity}</td>
                  <td className="px-3 py-1.5">
                    <Input
                      value={row.color}
                      maxLength={50}
                      onChange={(e) => set({ color: e.target.value })}
                      placeholder="Ex.: Azul"
                      aria-label={`Cor de ${p.name}`}
                      aria-invalid={bad || undefined}
                      className="h-8"
                    />
                  </td>
                  <td className="px-3 py-1.5">
                    <Input
                      value={row.size}
                      maxLength={20}
                      onChange={(e) => set({ size: e.target.value })}
                      placeholder="Ex.: M"
                      aria-label={`Tamanho de ${p.name}`}
                      aria-invalid={bad || undefined}
                      className="h-8"
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {errors.length > 0 && modelName && (
        <ul className="space-y-1 rounded-xl border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200">
          {errors.map((e) => (
            <li key={e} className="flex items-start gap-2">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
              {e}
            </li>
          ))}
        </ul>
      )}

      <DialogFooter className="gap-2">
        <Button type="button" variant="outline" onClick={onCancel} disabled={submitting} className="cursor-pointer">
          Cancelar
        </Button>
        <Button type="button" onClick={submit} disabled={errors.length > 0 || submitting} className="cursor-pointer">
          {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Layers className="h-4 w-4" />}
          Agrupar {products.length} {products.length === 1 ? "produto" : "produtos"}
        </Button>
      </DialogFooter>
    </div>
  );
}
