import { useFormContext, useWatch } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { brl } from "@/components/DashCard";
import { CreateSaleParams } from "@/interfaces/sale.interface";
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
  const { control } = useFormContext<CreateSaleParams>();
  const credit = useWatch({ control, name: "credit_amount" }) || 0;

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
          {credit > 0 && (
            <>
              <div className="mt-2 flex justify-between items-center text-sm">
                <span className="text-pink-700 dark:text-pink-300">Vale-troca</span>
                <span className="font-medium tabular-nums text-pink-700 dark:text-pink-300">
                  − {brl(credit)}
                </span>
              </div>
              <div className="mt-1 flex justify-between items-center">
                <span className="text-sm font-semibold">A pagar</span>
                <span className="text-lg font-bold tabular-nums">
                  {brl(Math.max(totalAmount - credit, 0))}
                </span>
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
