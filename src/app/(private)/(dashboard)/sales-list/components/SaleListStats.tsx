import { Card, CardContent } from "@/components/ui/card";

const formatCurrency = (value: number) =>
  value.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

interface Props {
  salesCount: number;
  totalInvoiced: number;
  totalPending: number;
  salesCanceled: number;
}

export const SaleListStats = ({
  salesCanceled,
  totalPending,
  totalInvoiced,
  salesCount,
}: Props) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Card>
        <CardContent className="pt-6">
          <p className="text-xs text-muted-foreground font-medium">
            Total de Vendas
          </p>
          <p className="text-2xl font-bold">{salesCount}</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6">
          <p className="text-xs text-muted-foreground font-medium">Faturado</p>
          <p className="text-2xl font-bold text-primary">
            R$ {formatCurrency(totalInvoiced)}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6">
          <p className="text-xs text-muted-foreground font-medium">Pendente</p>
          <p className="text-2xl font-bold text-yellow-600">
            R$ {formatCurrency(totalPending)}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6">
          <p className="text-xs text-muted-foreground font-medium">
            Canceladas
          </p>
          <p className="text-2xl font-bold text-destructive">{salesCanceled}</p>
        </CardContent>
      </Card>
    </div>
  );
};
