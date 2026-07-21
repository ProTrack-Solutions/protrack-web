import { translateMount } from "@/app/utils/transalate";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GetSummaryMonthResponse } from "@/interfaces/cash-flow.interface";

interface ComparativoPeriodosProps {
  dados: GetSummaryMonthResponse[];
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
              key={item.mount}
              className="space-y-3 p-4 rounded-lg bg-muted/30"
            >
              <h4 className="font-semibold text-foreground">
                {translateMount(item.mount)}
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    Entradas:
                  </span>
                  <span className="text-sm font-medium text-secondary">
                    R$ {item.total_inflow.toLocaleString("pt-BR")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Saídas:</span>
                  <span className="text-sm font-medium text-destructive">
                    R$ {item.total_outflow.toLocaleString("pt-BR")}
                  </span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span className="font-medium">Saldo:</span>
                  <span className="font-bold text-foreground">
                    R${" "}
                    {(item.total_inflow - item.total_outflow).toLocaleString(
                      "pt-BR",
                    )}
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
