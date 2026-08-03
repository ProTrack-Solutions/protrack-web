import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, Calendar, DollarSign } from "lucide-react";

interface ResumoCardsProps {
  totalPendente: number;
  totalVencido: number;
  totalContas: number;
}

export function SummaryCard({
  totalPendente,
  totalVencido,
  totalContas,
}: ResumoCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total a Receber</p>
              <h3 className="text-2xl font-bold text-foreground">
                R${" "}
                {totalPendente.toLocaleString("pt-BR", {
                  minimumFractionDigits: 2,
                })}
              </h3>
            </div>
            <DollarSign className="h-8 w-8 text-secondary" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Contas Vencidas</p>
              <h3 className="text-2xl font-bold text-destructive">
                R${" "}
                {totalVencido.toLocaleString("pt-BR", {
                  minimumFractionDigits: 2,
                })}
              </h3>
            </div>
            <AlertCircle className="h-8 w-8 text-destructive" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total de Contas</p>
              <h3 className="text-2xl font-bold text-foreground">
                {totalContas}
              </h3>
            </div>
            <Calendar className="h-8 w-8 text-primary" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
