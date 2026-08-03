import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown, DollarSign, Calendar } from "lucide-react";

interface ResumoCardsProps {
  saldoAtual: number;
  totalEntradas: number;
  totalSaidas: number;
  previsao5Dias: number;
}

function formatarMoeda(valor: number) {
  return valor.toLocaleString("pt-BR", { minimumFractionDigits: 2 });
}

export function ResumoCards({
  saldoAtual,
  totalEntradas,
  totalSaidas,
  previsao5Dias,
}: ResumoCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <Card className="bg-gradient-primary text-primary-foreground">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Saldo Atual</p>
              <h3 className="text-2xl font-bold">
                R$ {formatarMoeda(saldoAtual)}
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
              <p className="text-sm text-muted-foreground">Total Entradas</p>
              <h3 className="text-2xl font-bold text-secondary">
                R$ {formatarMoeda(totalEntradas)}
              </h3>
            </div>
            <TrendingUp className="h-8 w-8 text-secondary" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Saídas</p>
              <h3 className="text-2xl font-bold text-destructive">
                R$ {formatarMoeda(totalSaidas)}
              </h3>
            </div>
            <TrendingDown className="h-8 w-8 text-destructive" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Previsão</p>
              <h3 className="text-2xl font-bold text-foreground">
                R$ {formatarMoeda(previsao5Dias)}
              </h3>
            </div>
            <Calendar className="h-8 w-8 text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
