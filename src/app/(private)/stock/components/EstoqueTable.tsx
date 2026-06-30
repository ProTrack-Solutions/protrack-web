"use client";

import { Product } from "@/interfaces/stock.interface";
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
import { useState } from "react";
import { DialogEditProduct } from "@/components/DialogAlterProduct";

interface EstoqueTableProps {
  products: Product[];
}

function getQuantityStyle(quantity: number): string {
  if (quantity >= 10)
    return "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400";
  if (quantity >= 5)
    return "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400";
  return "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400";
}

export function EstoqueTable({ products }: EstoqueTableProps) {
  const { productsCategories } = useProductsCategories();

  const [openDialog, setOpenDialog] = useState(false);

  const [productSelect, setProductSelect] = useState<Product>({} as Product);
  return (
    <Card className="border-border/50 overflow-hidden pt-0">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50 border-b border-border">
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
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border border-blue-500/20 flex items-center justify-center">
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
                    <span className="inline-flex items-center justify-center min-w-[2.5rem] h-7 px-2 rounded-md border border-border bg-muted/50 text-sm font-semibold">
                      {product.size}
                    </span>
                  </TableCell>
                  <TableCell className="text-right font-semibold text-foreground">
                    R$ {product.sale_price.toFixed(2).replace(".", ",")}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge
                      variant="outline"
                      className={`${getQuantityStyle(product.quantity)} font-semibold min-w-[3rem] justify-center`}
                    >
                      {product.quantity} un
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
