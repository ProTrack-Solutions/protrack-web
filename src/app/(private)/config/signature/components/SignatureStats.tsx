import { Card, CardContent } from "@/components/ui/card";
import { BadgeCheck, CalendarDays, CreditCard, Receipt, XCircle } from "lucide-react";
import { Plano, brl } from "./types";

interface SignatureStatsProps {
  plano: Plano;
  cancelado: boolean;
  totalPago: number;
}

export function SignatureStats({
  plano,
  cancelado,
  totalPago,
}: SignatureStatsProps) {
  const stats = [
    {
      label: "Status",
      valor: cancelado ? "Cancelada" : "Ativa",
      icon: cancelado ? XCircle : BadgeCheck,
      cor: cancelado ? "text-rose-600" : "text-emerald-600",
    },
    {
      label: "Próxima cobrança",
      valor: cancelado ? "—" : "05/09/2026",
      icon: CalendarDays,
      cor: "text-blue-600",
    },
    {
      label: "Valor mensal",
      valor: brl(plano.preco),
      icon: CreditCard,
      cor: "text-indigo-600",
    },
    {
      label: "Total pago",
      valor: brl(totalPago),
      icon: Receipt,
      cor: "text-purple-600",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((s) => (
        <Card key={s.label} className="border-border/60 shadow-sm">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground font-medium">
                {s.label}
              </p>
              <p className={`text-xl font-bold mt-1 ${s.cor}`}>{s.valor}</p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center">
              <s.icon className={`w-5 h-5 ${s.cor}`} />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
