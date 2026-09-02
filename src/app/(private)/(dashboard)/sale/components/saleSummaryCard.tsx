import { useFormContext, useWatch } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreateSaleParams } from "@/interfaces/sale.interface";
import { Product } from "@/interfaces/products.interface";

interface Props {
  products: Product[];
}

export function SaleSummaryCard({ products }: Props) {
  const { control } = useFormContext<CreateSaleParams>();

  const produtos = useWatch({ control, name: "items" }) ?? [];

  const desconto = useWatch({ control, name: "discount_amount" });


  const totalItens = produtos.length;
  const totalQuantidade = produtos.reduce(
    (sum, p) => sum + (p.quantity || 0),
    0,
  );

  const totalValue = produtos.reduce((sum, item) => {
    const correspondente = products.find((p) => p.id === item.product_id);
    const preco = correspondente ? correspondente.sale_price : 0;
    const quantidade = item.quantity || 0;

    return sum + preco * quantidade;
  }, 0);

  const totalAmount = totalValue - desconto;

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
