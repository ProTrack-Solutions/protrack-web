import { useFormContext, useWatch } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { VendaForm } from "@/@types/sale.type";

export function SaleSummaryCard() {
  const { control } = useFormContext<VendaForm>();

  const produtos = useWatch({ control, name: "produtos" }) ?? [];

  const totalItens = produtos.length;
  const totalQuantidade = produtos.reduce(
    (sum, p) => sum + (p.quantidade || 0),
    0,
  );
  const totalValor = produtos.reduce(
    (sum, p) => sum + (p.quantidade || 0) * (p.precoUnitario || 0),
    0,
  );

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
              R$ {totalValor.toFixed(2)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
