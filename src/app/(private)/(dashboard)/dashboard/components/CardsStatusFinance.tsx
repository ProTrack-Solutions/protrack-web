import { Card, CardContent } from "@/components/ui/card";
import { DollarSign, CreditCard, TrendingUp } from "lucide-react";

interface Props {
  totalSalesPedding: number;
  totalBillsPayable: number;
}

export const CardsStatusFinance = ({
  totalSalesPedding,
  totalBillsPayable,
}: Props) => {
  const saldoTotal = 0 + totalSalesPedding - totalBillsPayable;
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card className="bg-gradient-primary text-primary-foreground">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Saldo Total</p>
              <h3 className="text-2xl font-bold">
                R${" "}
                {saldoTotal.toLocaleString("pt-BR", {
                  minimumFractionDigits: 2,
                })}
              </h3>
            </div>
            <DollarSign className="h-8 w-8 opacity-80" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Caixa</p>
              <h3 className="text-xl font-bold text-foreground">R$ {"..."}</h3>
            </div>
            <CreditCard className="h-6 w-6 text-muted-foreground" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-red-400">A Pagar</p>
              <h3 className="text-xl font-bold text-red-400">
                R${" "}
                {totalBillsPayable.toLocaleString("pt-BR", {
                  minimumFractionDigits: 2,
                })}
              </h3>
            </div>
            <CreditCard className="h-6 w-6 text-muted-foreground" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-secondary">A Receber</p>
              <h3 className="text-xl font-bold text-secondary">
                R${" "}
                {totalSalesPedding.toLocaleString("pt-BR", {
                  minimumFractionDigits: 2,
                })}
              </h3>
            </div>
            <TrendingUp className="h-6 w-6 text-secondary" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
