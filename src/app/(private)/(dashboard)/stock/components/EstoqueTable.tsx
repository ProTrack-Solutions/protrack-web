"use client";

import { Product } from "@/interfaces/products.interface";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Package, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useProductsCategories } from "@/hooks/useProductsCategories";
import { SetStateAction, useState } from "react";
import { DialogEditProduct } from "@/components/DialogAlterProduct";
import { getQuantityStyle, getUnitBadgeStyle } from "@/utils/productsQuantity";
import { Checkbox } from "@/components/ui/checkbox";

interface EstoqueTableProps {
  products: Product[];
  selectedRows: Set<string>;
  setSelectedRows: (param: SetStateAction<Set<string>>) => void;
}

export function EstoqueTable({
  products,
  selectedRows,
  setSelectedRows,
}: EstoqueTableProps) {
  const { productsCategories } = useProductsCategories();

  const [openDialog, setOpenDialog] = useState(false);

  console.log("selectedRows", selectedRows);

  const selectAll = selectedRows.size === products.length;
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRows(new Set(products.map((row) => row.id)));
    } else {
      setSelectedRows(new Set());
    }
  };

  const handleSelectRow = (id: string, checked: boolean) => {
    const newSelected = new Set(selectedRows);
    if (checked) {
      newSelected.add(id);
    } else {
      newSelected.delete(id);
    }
    setSelectedRows(newSelected);
  };

  const [productSelect, setProductSelect] = useState<Product>({} as Product);
  return (
    <Card className="border-border/50 overflow-hidden pt-0">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50 border-b border-border">
              <TableHead className="font-semibold text-foreground">
                <Checkbox
                  id="select-all-checkbox"
                  name="select-all-checkbox"
                  checked={selectAll}
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              <TableHead className="font-semibold text-foreground">
                Produto
              </TableHead>
              <TableHead className="font-semibold text-foreground">
                Código de Barras
              </TableHead>
              <TableHead className="font-semibold text-foreground">
                Categoria
              </TableHead>
              <TableHead className="font-semibold text-foreground">
                Tamanho
              </TableHead>
              <TableHead className="font-semibold text-foreground text-right">
                Preço
              </TableHead>
              <TableHead className="font-semibold text-foreground text-center">
                Estoque
              </TableHead>
              <TableHead className="font-semibold text-foreground text-right">
                Ações
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product, index) => {
              const categoriaDoProduto = productsCategories?.find(
                (cat) => cat.id === product.category_id,
              );

              const corDeFundo = categoriaDoProduto?.color + "60" || "#cccccc";
              return (
                <TableRow
                  key={index}
                  className="border-b border-border/50 hover:bg-muted/40 transition-colors"
                >
                  <TableCell className="py-4">
                    <Checkbox
                      id={`row-${product.id}-checkbox`}
                      name={`row-${product.id}-checkbox`}
                      checked={selectedRows.has(product.id)}
                      onCheckedChange={(checked) =>
                        handleSelectRow(product.id, checked === true)
                      }
                    />
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-linear-to-br from-blue-500/10 to-indigo-500/10 border border-blue-500/20 flex items-center justify-center">
                        <Package className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <span className="font-medium text-foreground">
                        {product.name}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-sm text-muted-foreground">
                    {product.barcode}
                  </TableCell>
                  <TableCell>
                    <Badge
                      style={{ backgroundColor: corDeFundo }}
                      variant="outline"
                      className={`font-medium`}
                    >
                      {product.category_name}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center justify-center min-w-7 h-7 px-2 rounded-md border border-border bg-muted/50 text-sm font-semibold">
                      {product.size ? product.size : "..."}
                    </span>
                  </TableCell>
                  <TableCell className="text-right font-semibold text-foreground">
                    R${" "}
                    {product.sell_in_bulk
                      ? product.sale_price.toFixed(2).replace(".", ",") +
                        product.unit
                      : product.sale_price.toFixed(2).replace(".", ",")}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge
                      variant="outline"
                      className={`${product.sell_in_bulk ? getUnitBadgeStyle(product.unit) : getQuantityStyle(product.quantity)} font-semibold min-w-12 justify-center`}
                    >
                      {product.sell_in_bulk
                        ? product.unit
                        : product.quantity + "un"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      onClick={() => {
                        setOpenDialog(true);
                        setProductSelect(product);
                      }}
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 cursor-pointer text-muted-foreground hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-500/10"
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
            {products.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="h-32 text-center text-muted-foreground"
                >
                  Nenhum produto encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <DialogEditProduct
        open={openDialog}
        product={productSelect}
        key={productSelect?.id}
        onOpenChange={setOpenDialog}
      />
    </Card>
  );
}
