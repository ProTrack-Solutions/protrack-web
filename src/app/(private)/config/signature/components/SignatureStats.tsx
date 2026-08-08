import { Card, CardContent } from "@/components/ui/card";
import {
  BadgeCheck,
  CalendarDays,
  CreditCard,
  Receipt,
  XCircle,
} from "lucide-react";
import { brl } from "./types";
import { PlansResponse } from "@/interfaces/plans.interface";

interface SignatureStatsProps {
  plano: PlansResponse;
  status: string;
  totalPago: number;
  proximaCobranca: string;
}

export function SignatureStats({
  plano,
  status,
  totalPago,
  proximaCobranca,
}: SignatureStatsProps) {
  const stats = [
    {
      label: "Status",
      valor: status == "canceled" ? "Cancelada" : "Ativa",
      icon: status == "canceled" ? XCircle : BadgeCheck,
      cor: status == "canceled" ? "text-rose-600" : "text-emerald-600",
    },
    {
      label: "Próxima cobrança",
      valor: status == "canceled" ? "—" : proximaCobranca,
      icon: CalendarDays,
      cor: "text-blue-600",
    },
    {
      label: "Valor mensal",
      valor: brl(plano.price_cents / 100),
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
