import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Plano, brl } from "./types";

interface NextInvoiceCardProps {
  plano: Plano;
  cancelado: boolean;
}

export function NextInvoiceCard({ plano, cancelado }: NextInvoiceCardProps) {
  return (
    <Card className="lg:col-span-2 border-border/60 shadow-sm">
      <CardHeader>
        <CardTitle className="text-base">Próxima fatura</CardTitle>
        <CardDescription>
          Resumo da cobrança do próximo ciclo.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">
            Plano {plano.nome} (mensal)
          </span>
          <span>{brl(plano.preco)}</span>
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
          <span className="font-semibold">Total em 05/09/2026</span>
          <span className="text-2xl font-bold text-blue-600">
            {cancelado ? brl(0) : brl(plano.preco)}
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
