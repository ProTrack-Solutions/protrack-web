"use client";

import { ReactNode, useState } from "react";
import {
  ArrowDownUp,
  ChevronRight,
  Layers,
  Loader2,
  Package,
  PackageSearch,
  Pencil,
  Tag,
  Receipt,
} from "lucide-react";
import {
  ModelVariation,
  Product,
  StockEntry,
} from "@/interfaces/products.interface";
import { useProductsCategories } from "@/hooks/useProductsCategories";
import { useModelVariations } from "@/hooks/useProductGrid";
import { DialogEditProduct } from "@/components/DialogAlterProduct";
import { DialogStockMovement } from "@/components/DialogStockMovement";
import { DialogModelStock } from "@/components/ProductGrid/DialogModelStock";
import { DialogModelLabels } from "@/components/ProductGrid/DialogModelLabels";
import { DialogEditModel } from "@/components/ProductGrid/DialogEditModel";
import {
  DialogProductFiscal,
  FiscalTarget,
} from "@/components/Fiscal/DialogProductFiscal";
import { variationLabel } from "@/components/ProductGrid/grid";
import {
  entryToProduct,
  variationToProduct,
} from "@/components/ProductGrid/toProduct";
import { Skeleton, brl } from "@/components/DashCard";
import { getQuantityStyle, getUnitBadgeStyle } from "@/utils/productsQuantity";
import { useLowStockThreshold } from "@/hooks/useCompanySettings";
import { Checkbox } from "@/components/ui/checkbox";

/** O que a seleção guarda de cada produto (etiquetas e "Agrupar em modelo") */
export interface SelectedProduct {
  id: string;
  name: string;
  size: string;
  quantity: number;
  category_id: string;
  model_name: string;
  sell_in_bulk: boolean;
}

interface EstoqueTableProps {
  entries: StockEntry[];
  productsCount: number;
  loading: boolean;
  searchTerm: string;
  selected: Map<string, SelectedProduct>;
  onToggle: (product: SelectedProduct, checked: boolean) => void;
  onSelectAll: (checked: boolean) => void;
  selectingAll?: boolean;
  footer?: ReactNode;
}

const FALLBACK_COLOR = "#94a3b8";

const th =
  "px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground";

const iconButton =
  "grid h-8 w-8 cursor-pointer place-items-center rounded-lg text-muted-foreground transition-colors";

const priceRange = (min: number, max: number) =>
  min === max ? brl(min) : `${brl(min)} – ${brl(max)}`;

export function EstoqueTable({
  entries,
  productsCount,
  loading,
  searchTerm,
  selected,
  onToggle,
  onSelectAll,
  selectingAll,
  footer,
}: EstoqueTableProps) {
  const { productsCategories } = useProductsCategories();
  const lowStock = useLowStockThreshold();

  // Diálogos de produto avulso (e de uma variação, no caso do estoque)
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [stockProduct, setStockProduct] = useState<Product | null>(null);
  // Diálogos do modelo
  const [stockModel, setStockModel] = useState<string | null>(null);
  const [labelsModel, setLabelsModel] = useState<string | null>(null);
  const [editModel, setEditModel] = useState<string | null>(null);
  // Dados fiscais (NFC-e) do produto ou do modelo inteiro
  const [fiscalTarget, setFiscalTarget] = useState<FiscalTarget | null>(null);

  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const toggleExpanded = (name: string) =>
    setExpanded((prev) => {
      const next = new Set(prev);
      const key = name.toLowerCase();
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });

  // A seleção conta produtos (variações uma a uma), em todas as páginas
  const selectAll = productsCount > 0 && selected.size === productsCount;
  const selectAllState: boolean | "indeterminate" =
    selected.size > 0 && !selectAll ? "indeterminate" : selectAll;

  const colorOf = (categoryId: string) =>
    productsCategories?.find((cat) => cat.id === categoryId)?.color ||
    FALLBACK_COLOR;

  return (
    <section
      className="dash-in overflow-hidden rounded-2xl border border-border/70 bg-card shadow-[var(--shadow-soft)]"
      style={{ animationDelay: "300ms" }}
    >
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] text-sm">
          <thead className="border-b border-border bg-muted/40 text-left">
            <tr>
              <th className={`${th} w-12`}>
                <Checkbox
                  id="select-all-checkbox"
                  name="select-all-checkbox"
                  aria-label="Selecionar todos os produtos"
                  checked={selectAllState}
                  disabled={selectingAll || loading}
                  onCheckedChange={(checked) => onSelectAll(checked === true)}
                />
              </th>
              <th className={th}>Produto</th>
              <th className={th}>Categoria</th>
              <th className={`${th} text-center`}>Tamanho</th>
              <th className={`${th} text-right`}>Preço</th>
              <th className={`${th} text-center`}>Cadastrados</th>
              <th className={`${th} text-center`}>Vendidos</th>
              <th className={`${th} text-center`}>Estoque</th>
              <th className={`${th} text-right`}>Ações</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-border/60">
            {loading &&
              Array.from({ length: 6 }, (_, i) => (
                <tr key={i}>
                  <td className="px-4 py-4">
                    <Skeleton className="h-4 w-4" />
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-10 w-10 rounded-xl" />
                      <div className="space-y-1.5">
                        <Skeleton className="h-4 w-40" />
                        <Skeleton className="h-3 w-24" />
                      </div>
                    </div>
                  </td>
                  {Array.from({ length: 7 }, (_, j) => (
                    <td key={j} className="px-4 py-4">
                      <Skeleton className="mx-auto h-5 w-14" />
                    </td>
                  ))}
                </tr>
              ))}

            {!loading &&
              entries.map((entry) => {
                const color = colorOf(entry.category_id);

                if (entry.kind === "model") {
                  const isOpen = expanded.has(entry.model_name.toLowerCase());
                  return (
                    <ModelRows
                      key={entry.key}
                      entry={entry}
                      color={color}
                      isOpen={isOpen}
                      lowStock={lowStock}
                      selected={selected}
                      onToggleExpand={() => toggleExpanded(entry.model_name)}
                      onToggle={onToggle}
                      onStockModel={() => setStockModel(entry.model_name)}
                      onLabelsModel={() => setLabelsModel(entry.model_name)}
                      onEditModel={() => setEditModel(entry.model_name)}
                      onFiscalModel={() =>
                        setFiscalTarget({ kind: "model", modelName: entry.model_name })
                      }
                      onStockVariation={(v) => setStockProduct(variationToProduct(v))}
                    />
                  );
                }

                const product = entryToProduct(entry);
                const isSelected = selected.has(product.id);
                return (
                  <tr
                    key={entry.key}
                    className={`group transition-colors ${
                      isSelected ? "bg-primary/5" : "hover:bg-muted/40"
                    }`}
                  >
                    <td className="px-4 py-3">
                      <Checkbox
                        id={`row-${product.id}-checkbox`}
                        name={`row-${product.id}-checkbox`}
                        aria-label={`Selecionar ${product.name}`}
                        checked={isSelected}
                        onCheckedChange={(checked) =>
                          onToggle(
                            {
                              id: product.id,
                              name: product.name,
                              size: product.size,
                              quantity: product.quantity,
                              category_id: product.category_id,
                              model_name: "",
                              sell_in_bulk: product.sell_in_bulk,
                            },
                            checked === true,
                          )
                        }
                      />
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <span
                          className="grid h-10 w-10 shrink-0 place-items-center rounded-xl"
                          style={{ backgroundColor: `${color}22`, color }}
                        >
                          <Package className="h-4 w-4" />
                        </span>
                        <div className="min-w-0">
                          <p className="truncate font-semibold text-foreground">
                            {product.name}
                          </p>
                          <p className="font-mono text-xs text-muted-foreground">
                            {product.barcode || "Sem código de barras"}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-3">
                      <CategoryBadge name={entry.category_name} color={color} />
                    </td>

                    <td className="px-4 py-3 text-center">
                      {product.size ? (
                        <SizeBadge>{product.size}</SizeBadge>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </td>

                    <td className="px-4 py-3 text-right font-semibold tabular-nums text-foreground">
                      {brl(product.sale_price)}
                      {product.sell_in_bulk && (
                        <span className="text-xs font-medium text-muted-foreground">
                          /{product.unit}
                        </span>
                      )}
                    </td>

                    <td className="px-4 py-3 text-center tabular-nums text-muted-foreground">
                      {product.sell_in_bulk ? "—" : product.total_registered}
                    </td>
                    <td className="px-4 py-3 text-center tabular-nums text-muted-foreground">
                      {product.sell_in_bulk ? "—" : product.total_sold}
                    </td>

                    <td className="px-4 py-3 text-center">
                      <span
                        className={`inline-flex min-w-12 items-center justify-center rounded-full border px-2.5 py-0.5 text-xs font-semibold tabular-nums ${
                          product.sell_in_bulk
                            ? getUnitBadgeStyle(product.unit)
                            : getQuantityStyle(product.quantity, lowStock)
                        }`}
                      >
                        {product.sell_in_bulk ? product.unit : product.quantity}
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
                        {!product.sell_in_bulk && (
                          <button
                            type="button"
                            onClick={() => setStockProduct(product)}
                            title="Movimentar estoque"
                            aria-label={`Movimentar estoque de ${product.name}`}
                            className={`${iconButton} hover:bg-secondary/15 hover:text-[hsl(150_45%_32%)]`}
                          >
                            <ArrowDownUp className="h-4 w-4" />
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() =>
                            setFiscalTarget({
                              kind: "product",
                              productId: product.id,
                              name: product.name,
                            })
                          }
                          title="Dados fiscais (NFC-e)"
                          aria-label={`Dados fiscais de ${product.name}`}
                          className={`${iconButton} hover:bg-primary/10 hover:text-primary`}
                        >
                          <Receipt className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditProduct(product)}
                          title="Editar produto"
                          aria-label={`Editar ${product.name}`}
                          className={`${iconButton} hover:bg-primary/10 hover:text-primary`}
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

            {!loading && entries.length === 0 && (
              <tr>
                <td colSpan={9} className="px-4 py-14">
                  <div className="flex flex-col items-center gap-2 text-center">
                    <span className="grid h-12 w-12 place-items-center rounded-2xl bg-muted text-muted-foreground">
                      <PackageSearch className="h-6 w-6" />
                    </span>
                    <p className="font-semibold text-foreground">
                      Nenhum produto encontrado
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {searchTerm
                        ? `Nada corresponde a “${searchTerm}”. Tente outro nome, cor ou código.`
                        : "Cadastre um produto para vê-lo aqui."}
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {footer}

      {editProduct && (
        <DialogEditProduct
          open
          product={editProduct}
          key={editProduct.id}
          onOpenChange={(open) => !open && setEditProduct(null)}
        />
      )}

      {stockProduct && (
        <DialogStockMovement
          open
          product={stockProduct}
          key={`stock-${stockProduct.id}`}
          onOpenChange={(open) => !open && setStockProduct(null)}
        />
      )}

      <DialogModelStock
        modelName={stockModel}
        onOpenChange={(open) => !open && setStockModel(null)}
      />
      <DialogModelLabels
        modelName={labelsModel}
        onOpenChange={(open) => !open && setLabelsModel(null)}
      />
      <DialogEditModel
        modelName={editModel}
        onOpenChange={(open) => !open && setEditModel(null)}
        onRenamed={(newName) => {
          // A linha expandida continua aberta com o nome novo
          if (!editModel) return;
          setExpanded((prev) => {
            const oldKey = editModel.toLowerCase();
            if (!prev.has(oldKey)) return prev;
            const next = new Set(prev);
            next.delete(oldKey);
            next.add(newName.toLowerCase());
            return next;
          });
        }}
      />
      <DialogProductFiscal
        target={fiscalTarget}
        onOpenChange={(open) => !open && setFiscalTarget(null)}
      />
    </section>
  );
}

function CategoryBadge({ name, color }: { name: string; color: string }) {
  return name ? (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-2.5 py-0.5 text-xs font-medium text-foreground">
      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
      {name}
    </span>
  ) : (
    <span className="text-xs text-muted-foreground">Sem categoria</span>
  );
}

function SizeBadge({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex h-7 min-w-7 items-center justify-center rounded-md border border-border bg-muted/50 px-2 text-xs font-semibold">
      {children}
    </span>
  );
}

interface ModelRowsProps {
  entry: StockEntry;
  color: string;
  isOpen: boolean;
  lowStock: number;
  selected: Map<string, SelectedProduct>;
  onToggleExpand: () => void;
  onToggle: (product: SelectedProduct, checked: boolean) => void;
  onStockModel: () => void;
  onLabelsModel: () => void;
  onEditModel: () => void;
  onFiscalModel: () => void;
  onStockVariation: (v: ModelVariation) => void;
}

/** Linha do modelo e, aberta, uma linha por variação */
function ModelRows({
  entry,
  color,
  isOpen,
  lowStock,
  selected,
  onToggleExpand,
  onToggle,
  onStockModel,
  onLabelsModel,
  onEditModel,
  onFiscalModel,
  onStockVariation,
}: ModelRowsProps) {
  const { data: variations, isLoading } = useModelVariations(
    isOpen ? entry.model_name : null,
  );

  const parts = [
    `${entry.variations} ${entry.variations === 1 ? "variação" : "variações"}`,
    entry.colors > 0 && `${entry.colors} ${entry.colors === 1 ? "cor" : "cores"}`,
    entry.sizes > 0 && `${entry.sizes} ${entry.sizes === 1 ? "tamanho" : "tamanhos"}`,
  ].filter(Boolean);

  return (
    <>
      <tr className={`transition-colors ${isOpen ? "bg-muted/30" : "hover:bg-muted/40"}`}>
        <td className="px-4 py-3">
          <button
            type="button"
            onClick={onToggleExpand}
            aria-expanded={isOpen}
            aria-label={`${isOpen ? "Recolher" : "Ver"} variações de ${entry.name}`}
            className="grid h-6 w-6 cursor-pointer place-items-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <ChevronRight className={`h-4 w-4 transition-transform ${isOpen ? "rotate-90" : ""}`} />
          </button>
        </td>

        <td className="px-4 py-3">
          <button
            type="button"
            onClick={onToggleExpand}
            className="flex cursor-pointer items-center gap-3 text-left"
          >
            <span
              className="grid h-10 w-10 shrink-0 place-items-center rounded-xl"
              style={{ backgroundColor: `${color}22`, color }}
            >
              <Layers className="h-4 w-4" />
            </span>
            <span className="min-w-0">
              <span className="block truncate font-semibold text-foreground">{entry.name}</span>
              <span className="block text-xs text-muted-foreground">{parts.join(" · ")}</span>
            </span>
          </button>
        </td>

        <td className="px-4 py-3">
          <CategoryBadge name={entry.category_name} color={color} />
        </td>

        <td className="px-4 py-3 text-center">
          <span className="inline-flex h-7 items-center justify-center rounded-md border border-fuchsia-200 bg-fuchsia-50 px-2 text-xs font-semibold text-fuchsia-700 dark:border-fuchsia-500/30 dark:bg-fuchsia-500/10 dark:text-fuchsia-300">
            Grade
          </span>
        </td>

        <td className="px-4 py-3 text-right font-semibold tabular-nums text-foreground">
          {priceRange(entry.min_sale_price, entry.max_sale_price)}
        </td>

        <td className="px-4 py-3 text-center tabular-nums text-muted-foreground">
          {entry.total_registered}
        </td>
        <td className="px-4 py-3 text-center tabular-nums text-muted-foreground">
          {entry.total_sold}
        </td>

        <td className="px-4 py-3 text-center">
          <span
            className={`inline-flex min-w-12 items-center justify-center rounded-full border px-2.5 py-0.5 text-xs font-semibold tabular-nums ${getQuantityStyle(entry.quantity, lowStock)}`}
          >
            {entry.quantity}
          </span>
          {entry.low_stock_variations > 0 && (
            <span className="mt-1 block text-[10px] font-medium text-amber-700 dark:text-amber-300">
              {entry.low_stock_variations} {entry.low_stock_variations === 1 ? "baixa" : "baixas"}
            </span>
          )}
        </td>

        <td className="px-4 py-3">
          <div className="flex justify-end gap-1">
            <button
              type="button"
              onClick={onStockModel}
              title="Movimentar estoque pela grade"
              aria-label={`Movimentar estoque de ${entry.name}`}
              className={`${iconButton} hover:bg-secondary/15 hover:text-[hsl(150_45%_32%)]`}
            >
              <ArrowDownUp className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={onLabelsModel}
              title="Etiquetas do modelo"
              aria-label={`Etiquetas de ${entry.name}`}
              className={`${iconButton} hover:bg-primary/10 hover:text-primary`}
            >
              <Tag className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={onFiscalModel}
              title="Dados fiscais do modelo (NFC-e)"
              aria-label={`Dados fiscais de ${entry.name}`}
              className={`${iconButton} hover:bg-primary/10 hover:text-primary`}
            >
              <Receipt className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={onEditModel}
              title="Editar modelo"
              aria-label={`Editar modelo ${entry.name}`}
              className={`${iconButton} hover:bg-primary/10 hover:text-primary`}
            >
              <Pencil className="h-4 w-4" />
            </button>
          </div>
        </td>
      </tr>

      {isOpen && isLoading && (
        <tr className="bg-muted/20">
          <td colSpan={9} className="px-4 py-4 text-center">
            <Loader2 className="mx-auto h-4 w-4 animate-spin text-muted-foreground" />
          </td>
        </tr>
      )}

      {isOpen &&
        variations?.map((v) => {
          const isSelected = selected.has(v.id);
          return (
            <tr
              key={v.id}
              className={`transition-colors ${isSelected ? "bg-primary/5" : "bg-muted/20 hover:bg-muted/40"}`}
            >
              <td className="px-4 py-2">
                <Checkbox
                  aria-label={`Selecionar ${v.name}`}
                  checked={isSelected}
                  onCheckedChange={(checked) =>
                    onToggle(
                      {
                        id: v.id,
                        name: v.name,
                        size: v.size,
                        quantity: v.quantity,
                        category_id: v.category_id,
                        model_name: v.model_name,
                        sell_in_bulk: v.sell_in_bulk,
                      },
                      checked === true,
                    )
                  }
                />
              </td>
              <td className="py-2 pl-[4.25rem] pr-4">
                <p className="font-medium text-foreground">{variationLabel(v.color, v.size)}</p>
                <p className="font-mono text-xs text-muted-foreground">{v.barcode || "Sem código de barras"}</p>
              </td>
              <td className="px-4 py-2" />
              <td className="px-4 py-2 text-center">
                {v.size ? <SizeBadge>{v.size}</SizeBadge> : <span className="text-muted-foreground">—</span>}
              </td>
              <td className="px-4 py-2 text-right tabular-nums text-foreground">{brl(v.sale_price)}</td>
              <td className="px-4 py-2 text-center tabular-nums text-muted-foreground">{v.total_registered}</td>
              <td className="px-4 py-2 text-center tabular-nums text-muted-foreground">{v.total_sold}</td>
              <td className="px-4 py-2 text-center">
                <span
                  className={`inline-flex min-w-12 items-center justify-center rounded-full border px-2.5 py-0.5 text-xs font-semibold tabular-nums ${getQuantityStyle(v.quantity, lowStock)}`}
                >
                  {v.quantity}
                </span>
              </td>
              <td className="px-4 py-2">
                <div className="flex justify-end gap-1">
                  <button
                    type="button"
                    onClick={() => onStockVariation(v)}
                    title="Movimentar estoque desta variação"
                    aria-label={`Movimentar estoque de ${v.name}`}
                    className={`${iconButton} hover:bg-secondary/15 hover:text-[hsl(150_45%_32%)]`}
                  >
                    <ArrowDownUp className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          );
        })}
    </>
  );
}
