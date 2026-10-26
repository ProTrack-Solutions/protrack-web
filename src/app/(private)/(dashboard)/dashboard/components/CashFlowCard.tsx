"use client";

import { useMemo } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { ArrowRight, LineChart } from "lucide-react";
import { useCashFlowSeries } from "@/hooks/useDashboard";
import { AnimatedNumber, DashCard, Skeleton } from "./shared";

const CashFlowChart = dynamic(() => import("./CashFlowChart"), {
  ssr: false,
  loading: () => <Skeleton className="h-[260px] w-full" />,
});

const monthFormatter = new Intl.DateTimeFormat("pt-BR", {
  month: "short",
  year: "2-digit",
});

// A API manda a data do mês ("2026-05", "2026-05-01", ISO...); vira "mai. de 26"
function monthLabel(date: string) {
  const match = /^(\d{4})-(\d{2})/.exec(date);
  if (!match) return date;
  const d = new Date(Number(match[1]), Number(match[2]) - 1, 1);
  return monthFormatter.format(d).replace(" de ", "/").replace(".", "");
}

export function CashFlowCard() {
  const { data, isLoading } = useCashFlowSeries();

  const points = useMemo(
    () =>
      (data ?? []).map((m) => ({
        label: monthLabel(m.date),
        inflow: m.total_inflow,
        outflow: m.total_outflow,
      })),
    [data],
  );

  const totals = useMemo(
    () =>
      points.reduce(
        (acc, p) => ({
          inflow: acc.inflow + p.inflow,
          outflow: acc.outflow + p.outflow,
        }),
        { inflow: 0, outflow: 0 },
      ),
    [points],
  );
  const net = totals.inflow - totals.outflow;

  return (
    <DashCard
      className="lg:col-span-2"
      title={`Fluxo de caixa${points.length ? ` · ${points.length} meses` : ""}`}
      icon={<LineChart className="h-4 w-4" />}
      delay={240}
      action={
        <Link
          href="/cash-flow"
          className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
        >
          Detalhes <ArrowRight className="h-3 w-3" />
        </Link>
      }
    >
      <dl className="mb-4 grid grid-cols-3 gap-3">
        {[
          {
            label: "Entradas",
            value: totals.inflow,
            dot: "bg-secondary",
            color: "text-[hsl(150_45%_35%)]",
          },
          {
            label: "Saídas",
            value: totals.outflow,
            dot: "bg-destructive",
            color: "text-destructive",
          },
          {
            label: "Resultado",
            value: net,
            dot: "bg-primary",
            color: net < 0 ? "text-destructive" : "text-foreground",
          },
        ].map((t) => (
          <div key={t.label}>
            <dt className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className={`h-2 w-2 rounded-full ${t.dot}`} /> {t.label}
            </dt>
            <dd className={`mt-0.5 text-sm font-bold sm:text-base ${t.color}`}>
              {isLoading ? (
                <Skeleton className="mt-1 h-5 w-24" />
              ) : (
                <AnimatedNumber value={t.value} />
              )}
            </dd>
          </div>
        ))}
      </dl>

      {isLoading ? (
        <Skeleton className="h-[260px] w-full" />
      ) : points.length === 0 ? (
        <div className="grid h-[260px] place-items-center rounded-xl border border-dashed border-border text-sm text-muted-foreground">
          Sem movimentações no período.
        </div>
      ) : (
        <CashFlowChart data={points} />
      )}
    </DashCard>
  );
}
