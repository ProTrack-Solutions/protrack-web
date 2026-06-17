import { Product } from "@/@types/stock.type";
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
import { Package } from "lucide-react";

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

const CATEGORY_STYLES: Record<string, string> = {
  Vestimenta:
    "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400",
  Calçados:
    "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-500/10 dark:text-purple-400",
  Acessórios:
    "bg-pink-50 text-pink-700 border-pink-200 dark:bg-pink-500/10 dark:text-pink-400",
};

function getCategoryStyle(category: string): string {
  return CATEGORY_STYLES[category] ?? "bg-muted text-foreground border-border";
}

export function EstoqueTable({ products }: EstoqueTableProps) {
  return (
    <Card className="border-border/50 overflow-hidden">
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
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product, index) => (
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
                      {product.nome}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="font-mono text-sm text-muted-foreground">
                  {product.codigoBarras}
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={`${getCategoryStyle(product.categoria)} font-medium`}
                  >
                    {product.categoria}
                  </Badge>
                </TableCell>
                <TableCell>
                  <span className="inline-flex items-center justify-center min-w-[2.5rem] h-7 px-2 rounded-md border border-border bg-muted/50 text-sm font-semibold">
                    {product.tamanho}
                  </span>
                </TableCell>
                <TableCell className="text-right font-semibold text-foreground">
                  R$ {product.preco.toFixed(2).replace(".", ",")}
                </TableCell>
                <TableCell className="text-center">
                  <Badge
                    variant="outline"
                    className={`${getQuantityStyle(product.quantidade)} font-semibold min-w-[3rem] justify-center`}
                  >
                    {product.quantidade} un
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
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
    </Card>
  );
}
