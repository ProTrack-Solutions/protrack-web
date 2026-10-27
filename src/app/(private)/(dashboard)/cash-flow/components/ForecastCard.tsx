"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { AlertTriangle, CalendarClock } from "lucide-react";
import { CashFlowForecast } from "@/interfaces/cash-flow.interface";
import { AnimatedNumber, DashCard, Skeleton, brl } from "@/components/DashCard";
import { POSITIVE_TEXT } from "./format";

const ForecastChart = dynamic(
  () => import("./charts").then((m) => m.ForecastChart),
  { ssr: false, loading: () => <Skeleton className="h-[180px] w-full" /> },
);

interface ForecastCardProps {
  forecast?: CashFlowForecast;
  loading: boolean;
}

export function ForecastCard({ forecast, loading }: ForecastCardProps) {
  const overdueIn = forecast?.overdue_receivable ?? 0;
  const overdueOut = forecast?.overdue_payable ?? 0;
  const net = forecast?.net ?? 0;
  const hasForecast = (forecast?.series ?? []).some(
    (p) => p.receivable || p.payable,
  );

  const rows = [
    {
      label: "A receber",
      value: forecast?.receivable ?? 0,
      dot: "bg-secondary",
      color: POSITIVE_TEXT,
      href: "/accounts-receivable",
    },
    {
      label: "A pagar",
      value: forecast?.payable ?? 0,
      dot: "bg-destructive",
      color: "text-destructive",
      href: "/accounts-payable",
    },
  ];

  return (
    <DashCard
      title={`Próximos ${forecast?.days ?? 30} dias`}
      icon={<CalendarClock className="h-4 w-4" />}
      delay={300}
    >
      <p className="text-xs font-medium text-muted-foreground">
        Saldo previsto
      </p>
      {loading ? (
        <Skeleton className="mt-1 h-8 w-40" />
      ) : (
        <p
          className={`text-2xl font-bold ${net < 0 ? "text-destructive" : "text-foreground"}`}
        >
          <AnimatedNumber value={net} />
        </p>
      )}

      <dl className="mt-3 grid grid-cols-2 gap-3">
        {rows.map((r) => (
          <Link
            key={r.label}
            href={r.href}
            className="rounded-xl bg-muted/40 px-3 py-2 transition-colors hover:bg-muted"
          >
            <dt className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className={`h-2 w-2 rounded-full ${r.dot}`} /> {r.label}
            </dt>
            <dd className={`mt-0.5 text-sm font-bold tabular-nums ${r.color}`}>
              {loading ? <Skeleton className="mt-1 h-4 w-20" /> : brl(r.value)}
            </dd>
          </Link>
        ))}
      </dl>

      <div className="mt-4 flex-1">
        {loading ? (
          <Skeleton className="h-[180px] w-full" />
        ) : hasForecast ? (
          <ForecastChart points={forecast!.series} />
        ) : (
          <div className="grid h-[180px] place-items-center rounded-xl border border-dashed border-border text-center text-sm text-muted-foreground">
            Nenhum recebimento ou pagamento
            <br />
            agendado para o período.
          </div>
        )}
      </div>

      {!loading && (overdueIn > 0 || overdueOut > 0) && (
        <div className="mt-4 flex gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-xs">
          <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600" />
          <p className="text-foreground">
            Fora da previsão, em atraso:{" "}
            {overdueIn > 0 && (
              <Link
                href="/accounts-receivable"
                className="font-semibold hover:underline"
              >
                {brl(overdueIn)} a receber
              </Link>
            )}
            {overdueIn > 0 && overdueOut > 0 && " e "}
            {overdueOut > 0 && (
              <Link
                href="/accounts-payable"
                className="font-semibold text-destructive hover:underline"
              >
                {brl(overdueOut)} a pagar
              </Link>
            )}
            .
          </p>
        </div>
      )}
    </DashCard>
  );
}
