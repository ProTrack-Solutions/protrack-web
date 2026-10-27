import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Product } from "@/interfaces/products.interface";
import { useSaleTotal } from "./useSaleTotal";

interface Props {
  products: Product[];
}

export function SaleSummaryCard({ products }: Props) {
  const {
    itemsCount: totalItens,
    quantity: totalQuantidade,
    total: totalAmount,
  } = useSaleTotal(products);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Resumo da Venda</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Itens:</span>
          <span className="font-medium">{totalItens}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">
            Total de Produtos:
          </span>
          <span className="font-medium">{totalQuantidade}</span>
        </div>
        <div className="border-t pt-4">
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold">Total:</span>
            <span className="text-2xl font-bold text-primary">
              R$ {totalAmount.toFixed(2)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
