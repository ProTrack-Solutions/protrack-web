"use client";

import { useMemo, useState } from "react";
import { AlertTriangle, Check, Loader2, Pencil, Plus, Save, Trash2 } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ModelVariation } from "@/interfaces/products.interface";
import {
  AddModelVariations,
  RemoveModelVariation,
  UpdateModel,
} from "@/service/products.service";
import { useInvalidateGrid, useModelVariations } from "@/hooks/useProductGrid";
import { useProductsCategories } from "@/hooks/useProductsCategories";
import { brl } from "@/components/DashCard";
import { getApiErrorMessage } from "@/utils/apiError";
import { ChipInput } from "./ChipInput";
import { GridMatrix } from "./GridMatrix";
import {
  SIZE_PRESETS,
  cellKey,
  gridAxes,
  modePrice,
  sortSizes,
  uniqueCI,
  variationLabel,
} from "./grid";

interface DialogEditModelProps {
  /** null fecha o diálogo */
  modelName: string | null;
  onOpenChange: (open: boolean) => void;
  /** Avisa o novo nome depois de salvar (a linha expandida acompanha) */
  onRenamed?: (newName: string) => void;
}

/** Edição do modelo inteiro: dados, preços, códigos, variações novas e removidas */
export function DialogEditModel({ modelName, onOpenChange, onRenamed }: DialogEditModelProps) {
  const { data: variations, isLoading } = useModelVariations(modelName);

  return (
    <Dialog open={!!modelName} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Pencil className="h-5 w-5 text-primary" />
            Editar modelo
          </DialogTitle>
          <DialogDescription>
            Nome, categoria e descrição valem para todas as variações. O preço do
            modelo vale para todas, menos as que têm preço próprio.
          </DialogDescription>
        </DialogHeader>

        {isLoading || !variations ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <EditForm
            // Remonta quando uma variação é removida/adicionada fora do formulário
            key={variations.map((v) => v.id).join()}
            currentName={modelName!}
            variations={variations}
            onClose={() => onOpenChange(false)}
            onRenamed={onRenamed}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

interface RowState {
  cost: number;
  price: number;
  barcode: string;
}

function EditForm({
  currentName,
  variations,
  onClose,
  onRenamed,
}: {
  currentName: string;
  variations: ModelVariation[];
  onClose: () => void;
  onRenamed?: (newName: string) => void;
}) {
  const invalidate = useInvalidateGrid();
  const { productsCategories } = useProductsCategories();
  const first = variations[0];

  const [name, setName] = useState(first.model_name);
  const [categoryId, setCategoryId] = useState(first.category_id);
  const [description, setDescription] = useState(first.description);

  const [baseCost, setBaseCost] = useState(() => modePrice(variations.map((v) => v.cost_price)));
  const [basePrice, setBasePrice] = useState(() => modePrice(variations.map((v) => v.sale_price)));
  const [rows, setRows] = useState<Record<string, RowState>>(() =>
    Object.fromEntries(
      variations.map((v) => [v.id, { cost: v.cost_price, price: v.sale_price, barcode: v.barcode }]),
    ),
  );

  // Cores/tamanhos novos e o estoque inicial de cada combinação nova
  const [newColors, setNewColors] = useState<string[]>([]);
  const [newSizes, setNewSizes] = useState<string[]>([]);
  const [newQty, setNewQty] = useState<Record<string, number>>({});

  const [confirmRemove, setConfirmRemove] = useState<string | null>(null);
  const [removing, setRemoving] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const existing = useMemo(() => gridAxes(variations), [variations]);

  // Mudar o preço do modelo arrasta junto só as variações que seguiam o preço antigo
  const changeBase = (field: "cost" | "price", value: number) => {
    const previous = field === "cost" ? baseCost : basePrice;
    setRows((r) =>
      Object.fromEntries(
        Object.entries(r).map(([id, row]) => [id, row[field] === previous ? { ...row, [field]: value } : row]),
      ),
    );
    if (field === "cost") setBaseCost(value);
    else setBasePrice(value);
  };

  const exceptions = variations.filter((v) => rows[v.id].cost !== baseCost || rows[v.id].price !== basePrice);
  const applyBaseToAll = () =>
    setRows((r) =>
      Object.fromEntries(Object.entries(r).map(([id, row]) => [id, { ...row, cost: baseCost, price: basePrice }])),
    );

  // Matriz das combinações novas: eixos atuais + os novos; as que já existem ficam bloqueadas
  const addColors = uniqueCI([...existing.colors, ...newColors]);
  const addSizes = sortSizes(uniqueCI([...existing.sizes, ...newSizes]));
  const hasNewAxes = newColors.length + newSizes.length > 0;
  const newCombos = useMemo(() => {
    if (!hasNewAxes) return [];
    const rowsAxis = addColors.length ? addColors : [""];
    const colsAxis = addSizes.length ? addSizes : [""];
    return rowsAxis
      .flatMap((color) => colsAxis.map((size) => ({ color, size, key: cellKey(color, size) })))
      .filter((c) => !existing.byKey.has(c.key))
      // Variação zerada não é cadastrada (a API também recusa)
      .filter((c) => (newQty[c.key] || 0) > 0);
  }, [hasNewAxes, addColors, addSizes, existing.byKey, newQty]);

  const errors = [
    name.trim().length < 2 && "Informe o nome do modelo.",
    !categoryId && "Escolha a categoria.",
  ].filter(Boolean) as string[];

  const remove = async (v: ModelVariation) => {
    if (confirmRemove !== v.id) {
      setConfirmRemove(v.id);
      return;
    }
    setRemoving(v.id);
    try {
      await RemoveModelVariation(v.id);
      toast.success(`Variação ${variationLabel(v.color, v.size)} removida.`);
      invalidate();
      if (variations.length === 1) onClose();
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Não foi possível remover a variação."));
    } finally {
      setRemoving(null);
      setConfirmRemove(null);
    }
  };

  const save = async () => {
    if (errors.length || saving) return;
    setSaving(true);
    const newName = name.trim();
    try {
      await UpdateModel(currentName, {
        model_name: newName,
        category_id: categoryId,
        description: description.trim(),
        variations: variations.map((v) => {
          const row = rows[v.id];
          const barcode = row.barcode.trim();
          return {
            id: v.id,
            cost_price: row.cost,
            sale_price: row.price,
            barcode: barcode && barcode !== v.barcode ? barcode : undefined,
          };
        }),
      });
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Não foi possível salvar o modelo."));
      setSaving(false);
      return;
    }

    if (newCombos.length) {
      try {
        await AddModelVariations(newName, {
          cost_price: baseCost,
          sale_price: basePrice,
          variations: newCombos.map((c) => ({ color: c.color, size: c.size, quantity: newQty[c.key] || 0 })),
        });
      } catch (error) {
        invalidate();
        onRenamed?.(newName);
        toast.error(
          `Modelo salvo, mas as variações novas não foram criadas: ${getApiErrorMessage(error, "erro inesperado")}`,
        );
        setSaving(false);
        return;
      }
    }

    toast.success(
      newCombos.length
        ? `Modelo salvo e ${newCombos.length} ${newCombos.length === 1 ? "variação adicionada" : "variações adicionadas"}.`
        : "Modelo salvo.",
    );
    // Fecha antes de invalidar: aberto, o diálogo buscaria de novo o nome antigo
    setSaving(false);
    onRenamed?.(newName);
    onClose();
    invalidate();
  };

  const moneyInput = (value: number, onChange: (v: number) => void, label: string, className = "h-8") => (
    <Input
      type="number"
      min={0}
      step="0.01"
      inputMode="decimal"
      value={value || ""}
      placeholder="0,00"
      onChange={(e) => onChange(Math.max(0, Number(e.target.value) || 0))}
      aria-label={label}
      className={`${className} text-right`}
    />
  );

  return (
    <div className="space-y-6">
      {/* Dados do modelo */}
      <section className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="edit-model-name">
            Nome do modelo <span className="text-destructive">*</span>
          </Label>
          <Input
            id="edit-model-name"
            value={name}
            maxLength={100}
            onChange={(e) => setName(e.target.value)}
            className="h-10"
          />
          {name.trim() && name.trim() !== first.model_name && (
            <p className="text-xs text-muted-foreground">
              As variações passam a se chamar &quot;{name.trim()} – {variationLabel(first.color, first.size)}&quot; etc.
            </p>
          )}
        </div>
        <div className="space-y-1.5">
          <Label>
            Categoria <span className="text-destructive">*</span>
          </Label>
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
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label>Custo do modelo</Label>
            {moneyInput(baseCost, (v) => changeBase("cost", v), "Custo do modelo", "h-10")}
          </div>
          <div className="space-y-1.5">
            <Label>Venda do modelo</Label>
            {moneyInput(basePrice, (v) => changeBase("price", v), "Preço de venda do modelo", "h-10")}
          </div>
        </div>
        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="edit-model-description">Descrição</Label>
          <Textarea
            id="edit-model-description"
            value={description}
            maxLength={1000}
            onChange={(e) => setDescription(e.target.value)}
            className="min-h-16 resize-none"
          />
        </div>
      </section>

      {exceptions.length > 0 && (
        <div className="flex flex-col gap-2 rounded-xl border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900 sm:flex-row sm:items-center sm:justify-between dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200">
          <p className="flex items-start gap-2">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
            {exceptions.length === 1
              ? "1 variação tem preço próprio e não segue o preço do modelo."
              : `${exceptions.length} variações têm preço próprio e não seguem o preço do modelo.`}
          </p>
          <Button type="button" size="sm" variant="outline" onClick={applyBaseToAll} className="cursor-pointer">
            Aplicar {brl(basePrice)} a todas
          </Button>
        </div>
      )}

      {/* Variações cadastradas */}
      <section className="space-y-2">
        <h3 className="text-sm font-semibold">Variações ({variations.length})</h3>
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full min-w-[640px] text-sm">
            <thead className="bg-muted/40 text-xs text-muted-foreground">
              <tr>
                <th className="px-3 py-2 text-left font-semibold">Variação</th>
                <th className="px-3 py-2 text-center font-semibold">Estoque</th>
                <th className="px-3 py-2 text-left font-semibold">Código de barras</th>
                <th className="w-28 px-3 py-2 text-right font-semibold">Custo</th>
                <th className="w-28 px-3 py-2 text-right font-semibold">Venda</th>
                <th className="w-12 px-3 py-2" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {variations.map((v) => {
                const row = rows[v.id];
                const own = row.cost !== baseCost || row.price !== basePrice;
                return (
                  <tr key={v.id}>
                    <td className="px-3 py-1.5">
                      <span className="font-medium">{variationLabel(v.color, v.size)}</span>
                      {own && (
                        <span className="ml-2 rounded-full bg-amber-100 px-1.5 py-0.5 text-[10px] font-semibold text-amber-800 dark:bg-amber-500/20 dark:text-amber-200">
                          preço próprio
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-1.5 text-center tabular-nums">{v.quantity}</td>
                    <td className="px-3 py-1.5">
                      <Input
                        value={row.barcode}
                        maxLength={50}
                        onChange={(e) => setRows((r) => ({ ...r, [v.id]: { ...r[v.id], barcode: e.target.value } }))}
                        aria-label={`Código de barras de ${variationLabel(v.color, v.size)}`}
                        className="h-8 font-mono text-xs"
                      />
                    </td>
                    <td className="px-3 py-1.5">
                      {moneyInput(row.cost, (cost) => setRows((r) => ({ ...r, [v.id]: { ...r[v.id], cost } })), `Custo de ${variationLabel(v.color, v.size)}`)}
                    </td>
                    <td className="px-3 py-1.5">
                      {moneyInput(row.price, (price) => setRows((r) => ({ ...r, [v.id]: { ...r[v.id], price } })), `Preço de ${variationLabel(v.color, v.size)}`)}
                    </td>
                    <td className="px-3 py-1.5 text-right">
                      <button
                        type="button"
                        onClick={() => remove(v)}
                        onBlur={() => confirmRemove === v.id && setConfirmRemove(null)}
                        disabled={v.quantity !== 0 || removing === v.id}
                        title={
                          v.quantity !== 0
                            ? "Só dá para remover variação sem estoque. Zere o saldo com um ajuste antes."
                            : confirmRemove === v.id
                              ? "Clique de novo para confirmar"
                              : "Remover variação"
                        }
                        aria-label={`Remover ${variationLabel(v.color, v.size)}`}
                        className={`grid h-8 w-8 cursor-pointer place-items-center rounded-lg transition-colors disabled:cursor-not-allowed disabled:opacity-30 ${
                          confirmRemove === v.id
                            ? "bg-destructive text-white"
                            : "text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                        }`}
                      >
                        {removing === v.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : confirmRemove === v.id ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* Variações novas */}
      <section className="space-y-3 rounded-xl border border-dashed border-border p-4">
        <h3 className="flex items-center gap-1.5 text-sm font-semibold">
          <Plus className="h-4 w-4" />
          Adicionar cores ou tamanhos
        </h3>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="edit-new-sizes" className="text-xs">
              Tamanhos novos
            </Label>
            <ChipInput
              id="edit-new-sizes"
              values={newSizes}
              onChange={(v) => setNewSizes(v.filter((s) => !existing.sizes.some((e) => e.toLowerCase() === s.toLowerCase())))}
              placeholder="Ex.: GG"
              presets={SIZE_PRESETS}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="edit-new-colors" className="text-xs">
              Cores novas
            </Label>
            <ChipInput
              id="edit-new-colors"
              values={newColors}
              onChange={(v) => setNewColors(v.filter((c) => !existing.colors.some((e) => e.toLowerCase() === c.toLowerCase())))}
              maxLength={50}
              placeholder="Ex.: Verde"
            />
          </div>
        </div>
        {hasNewAxes && (
          <>
            <GridMatrix
              colors={addColors}
              sizes={addSizes}
              quantities={newQty}
              onChange={(key, qty) => setNewQty((q) => ({ ...q, [key]: qty }))}
              isAvailable={(color, size) => !existing.byKey.has(cellKey(color, size))}
              unavailableTitle="Já cadastrada"
            />
            {newCombos.length === 0 ? (
              <p className="flex items-start gap-1.5 rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-xs text-amber-900 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200">
                <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                Informe o estoque das combinações novas. Variação sem estoque não é cadastrada.
              </p>
            ) : (
              <p className="text-xs text-muted-foreground">
                {newCombos.length} {newCombos.length === 1 ? "variação nova" : "variações novas"} pelo
                preço do modelo ({brl(basePrice)}). As combinações zeradas ficam de fora.
              </p>
            )}
          </>
        )}
      </section>

      <DialogFooter className="gap-2">
        <Button type="button" variant="outline" onClick={onClose} disabled={saving} className="cursor-pointer">
          Cancelar
        </Button>
        <Button type="button" onClick={save} disabled={errors.length > 0 || saving} className="cursor-pointer">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Salvar modelo
        </Button>
      </DialogFooter>
    </div>
  );
}
