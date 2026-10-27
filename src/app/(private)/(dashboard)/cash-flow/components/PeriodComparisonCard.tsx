"use client";

import { GitCompareArrows } from "lucide-react";
import { CashFlowTotals } from "@/interfaces/cash-flow.interface";
import {
  DashCard,
  Skeleton,
  TrendBadge,
  brl,
  percentChange,
} from "@/components/DashCard";

interface PeriodComparisonCardProps {
  current?: CashFlowTotals;
  previous?: CashFlowTotals;
  loading: boolean;
}

export function PeriodComparisonCard({
  current,
  previous,
  loading,
}: PeriodComparisonCardProps) {
  const rows = [
    {
      label: "Entradas",
      now: current?.inflow ?? 0,
      before: previous?.inflow ?? 0,
      bar: "bg-secondary",
      invert: false,
    },
    {
      label: "Saídas",
      now: current?.outflow ?? 0,
      before: previous?.outflow ?? 0,
      bar: "bg-destructive",
      invert: true,
    },
    {
      label: "Resultado",
      now: current?.net ?? 0,
      before: previous?.net ?? 0,
      bar: "bg-primary",
      invert: false,
    },
  ];
  const max = Math.max(
    ...rows.flatMap((r) => [Math.abs(r.now), Math.abs(r.before)]),
    1,
  );

  return (
    <DashCard
      title="Comparado ao período anterior"
      icon={<GitCompareArrows className="h-4 w-4" />}
      delay={480}
    >
      <ul className="space-y-5">
        {rows.map((r) => (
          <li key={r.label}>
            <div className="mb-1.5 flex items-center justify-between gap-2 text-sm">
              <span className="font-medium text-foreground">{r.label}</span>
              {!loading && (
                <TrendBadge
                  value={percentChange(r.now, r.before)}
                  invert={r.invert}
                />
              )}
            </div>
            {loading ? (
              <Skeleton className="h-9 w-full" />
            ) : (
              <div className="space-y-1">
                {[
                  { value: r.now, label: "Atual", className: r.bar },
                  {
                    value: r.before,
                    label: "Anterior",
                    className: "bg-muted-foreground/30",
                  },
                ].map((b) => (
                  <div
                    key={b.label}
                    className="flex items-center gap-2 text-xs"
                  >
                    <span className="w-14 shrink-0 text-muted-foreground">
                      {b.label}
                    </span>
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                      <div
                        className={`h-full rounded-full transition-[width] duration-700 ease-out ${
                          b.value < 0 ? "bg-destructive" : b.className
                        }`}
                        style={{ width: `${(Math.abs(b.value) / max) * 100}%` }}
                      />
                    </div>
                    <span
                      className={`w-24 shrink-0 text-right font-semibold tabular-nums ${
                        b.value < 0 ? "text-destructive" : "text-foreground"
                      }`}
                    >
                      {brl(b.value)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </li>
        ))}
      </ul>
    </DashCard>
  );
}
