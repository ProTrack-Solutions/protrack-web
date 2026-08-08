import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { brl } from "./types";
import { PlansResponse } from "@/interfaces/plans.interface";

interface NextInvoiceCardProps {
  plano: PlansResponse;
  status: string;
  proximaCobranca: string;
}

export function NextInvoiceCard({
  plano,
  status,
  proximaCobranca,
}: NextInvoiceCardProps) {
  const cancelado = status === "canceled";

  return (
    <Card className="lg:col-span-2 border-border/60 shadow-sm">
      <CardHeader>
        <CardTitle className="text-base">Próxima fatura</CardTitle>
        <CardDescription>Resumo da cobrança do próximo ciclo.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">
            Plano {plano.name} (mensal)
          </span>
          <span>{brl(plano.price_cents / 100)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Impostos</span>
          <span>{brl(0)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Descontos</span>
          <span className="text-emerald-600">- {brl(0)}</span>
        </div>
        <Separator />
        <div className="flex justify-between items-center">
          <span className="font-semibold">Total em {proximaCobranca}</span>
          <span className="text-2xl font-bold text-blue-600">
            {cancelado ? brl(0) : brl(plano.price_cents / 100)}
          </span>
        </div>
        {cancelado && (
          <p className="text-xs text-muted-foreground">
            Assinatura cancelada — nenhuma nova cobrança será realizada.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
