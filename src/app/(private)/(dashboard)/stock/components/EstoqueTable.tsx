"use client";

import { ReactNode, SetStateAction, useState } from "react";
import { ArrowDownUp, PackageSearch, Package, Pencil } from "lucide-react";
import { Product } from "@/interfaces/products.interface";
import { useProductsCategories } from "@/hooks/useProductsCategories";
import { DialogEditProduct } from "@/components/DialogAlterProduct";
import { DialogStockMovement } from "@/components/DialogStockMovement";
import { Skeleton, brl } from "@/components/DashCard";
import { getQuantityStyle, getUnitBadgeStyle } from "@/utils/productsQuantity";
import { useLowStockThreshold } from "@/hooks/useCompanySettings";
import { Checkbox } from "@/components/ui/checkbox";

interface EstoqueTableProps {
  products: Product[];
  productsCount: number;
  loading: boolean;
  searchTerm: string;
  selectedRows: Set<string>;
  setSelectedRows: (param: SetStateAction<Set<string>>) => void;
  onSelectAll: (checked: boolean) => void;
  selectingAll?: boolean;
  footer?: ReactNode;
}

const FALLBACK_COLOR = "#94a3b8";

const th =
  "px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground";

const iconButton =
  "grid h-8 w-8 cursor-pointer place-items-center rounded-lg text-muted-foreground transition-colors";

export function EstoqueTable({
  products,
  productsCount,
  loading,
  searchTerm,
  selectedRows,
  setSelectedRows,
  onSelectAll,
  selectingAll,
  footer,
}: EstoqueTableProps) {
  const { productsCategories } = useProductsCategories();
  const lowStock = useLowStockThreshold();

  const [openDialog, setOpenDialog] = useState(false);
  const [openStockDialog, setOpenStockDialog] = useState(false);
  const [productSelect, setProductSelect] = useState<Product>({} as Product);

  // Os produtos são buscados paginados, então o header considera o total
  // de produtos (todas as páginas), e não apenas os itens da página atual.
  const selectAll = productsCount > 0 && selectedRows.size === productsCount;
  const selectAllState: boolean | "indeterminate" =
    selectedRows.size > 0 && !selectAll ? "indeterminate" : selectAll;

  const handleSelectRow = (id: string, checked: boolean) => {
    const newSelected = new Set(selectedRows);
    if (checked) {
      newSelected.add(id);
    } else {
      newSelected.delete(id);
    }
    setSelectedRows(newSelected);
  };

  const colorOf = (product: Product) =>
    productsCategories?.find((cat) => cat.id === product.category_id)?.color ||
    FALLBACK_COLOR;

  return (
    <section
      className="dash-in overflow-hidden rounded-2xl border border-border/70 bg-card shadow-[var(--shadow-soft)]"
      style={{ animationDelay: "300ms" }}
    >
      <div className="overflow-x-auto">
        <table className="w-full min-w-[860px] text-sm">
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
              products.map((product) => {
                const color = colorOf(product);
                const selected = selectedRows.has(product.id);

                return (
                  <tr
                    key={product.id}
                    className={`group transition-colors ${
                      selected ? "bg-primary/5" : "hover:bg-muted/40"
                    }`}
                  >
                    <td className="px-4 py-3">
                      <Checkbox
                        id={`row-${product.id}-checkbox`}
                        name={`row-${product.id}-checkbox`}
                        aria-label={`Selecionar ${product.name}`}
                        checked={selected}
                        onCheckedChange={(checked) =>
                          handleSelectRow(product.id, checked === true)
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
                      {product.category_name ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-2.5 py-0.5 text-xs font-medium text-foreground">
                          <span
                            className="h-2 w-2 rounded-full"
                            style={{ backgroundColor: color }}
                          />
                          {product.category_name}
                        </span>
                      ) : (
                        <span className="text-xs text-muted-foreground">
                          Sem categoria
                        </span>
                      )}
                    </td>

                    <td className="px-4 py-3 text-center">
                      {product.size ? (
                        <span className="inline-flex h-7 min-w-7 items-center justify-center rounded-md border border-border bg-muted/50 px-2 text-xs font-semibold">
                          {product.size}
                        </span>
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
                      {product.sell_in_bulk
                        ? "—"
                        : (product.total_registered ?? 0)}
                    </td>
                    <td className="px-4 py-3 text-center tabular-nums text-muted-foreground">
                      {product.sell_in_bulk ? "—" : (product.total_sold ?? 0)}
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
                            onClick={() => {
                              setProductSelect(product);
                              setOpenStockDialog(true);
                            }}
                            title="Movimentar estoque"
                            aria-label={`Movimentar estoque de ${product.name}`}
                            className={`${iconButton} hover:bg-secondary/15 hover:text-[hsl(150_45%_32%)]`}
                          >
                            <ArrowDownUp className="h-4 w-4" />
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => {
                            setProductSelect(product);
                            setOpenDialog(true);
                          }}
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

            {!loading && products.length === 0 && (
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
                        ? `Nada corresponde a “${searchTerm}”. Tente outro nome ou código.`
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

      <DialogEditProduct
        open={openDialog}
        product={productSelect}
        key={productSelect?.id}
        onOpenChange={setOpenDialog}
      />

      {openStockDialog && (
        <DialogStockMovement
          open={openStockDialog}
          product={productSelect}
          key={`stock-${productSelect?.id}`}
          onOpenChange={setOpenStockDialog}
        />
      )}
    </section>
  );
}
