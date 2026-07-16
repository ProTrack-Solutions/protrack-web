import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ComparativoPeriodo } from "../page";

interface ComparativoPeriodosProps {
  dados: ComparativoPeriodo[];
}

export function ComparativoPeriodos({ dados }: ComparativoPeriodosProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Comparativo entre Períodos</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {dados.map((item) => (
            <div
              key={item.periodo}
              className="space-y-3 p-4 rounded-lg bg-muted/30"
            >
              <h4 className="font-semibold text-foreground">{item.periodo}</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    Entradas:
                  </span>
                  <span className="text-sm font-medium text-secondary">
                    R$ {item.entradas.toLocaleString("pt-BR")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Saídas:</span>
                  <span className="text-sm font-medium text-destructive">
                    R$ {item.saidas.toLocaleString("pt-BR")}
                  </span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span className="font-medium">Saldo:</span>
                  <span className="font-bold text-foreground">
                    R$ {item.saldo.toLocaleString("pt-BR")}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
