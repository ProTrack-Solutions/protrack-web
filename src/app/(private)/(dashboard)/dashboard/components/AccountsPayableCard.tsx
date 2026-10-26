"use client";

import Link from "next/link";
import { ArrowRight, CalendarClock } from "lucide-react";
import { useBillsPayableSummary } from "@/hooks/useDashboard";
import { AnimatedNumber, DashCard, Skeleton, brl } from "./shared";

export function AccountsPayableCard() {
  const { data, isLoading } = useBillsPayableSummary();

  const overdue = data?.total_overdue ?? 0;
  const today = data?.total_due_today ?? 0;
  const next7 = data?.total_next_7_days ?? 0;
  const pending = data?.total_pending ?? 0;
  // Restante pendente que vence depois dos próximos 7 dias
  const later = Math.max(0, pending - overdue - today - next7);

  const segments = [
    {
      label: "Vencidas",
      value: overdue,
      color: "bg-destructive",
      text: "text-destructive",
    },
    {
      label: "Vencem hoje",
      value: today,
      color: "bg-amber-500",
      text: "text-amber-600",
    },
    {
      label: "Próximos 7 dias",
      value: next7,
      color: "bg-primary",
      text: "text-foreground",
    },
    {
      label: "Depois",
      value: later,
      color: "bg-muted-foreground/30",
      text: "text-muted-foreground",
    },
  ];
  const total = segments.reduce((s, x) => s + x.value, 0);

  return (
    <DashCard
      title="Contas a pagar"
      icon={<CalendarClock className="h-4 w-4" />}
      delay={480}
      action={
        <Link
          href="/accounts-payable"
          className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
        >
          Gerenciar <ArrowRight className="h-3 w-3" />
        </Link>
      }
    >
      <p className="text-xs font-medium text-muted-foreground">
        Total pendente
      </p>
      {isLoading ? (
        <Skeleton className="mt-1 h-8 w-40" />
      ) : (
        <p className="text-2xl font-bold text-destructive">
          <AnimatedNumber value={pending} />
        </p>
      )}

      {/* barra segmentada por vencimento */}
      <div className="mt-5 flex h-2.5 gap-0.5 overflow-hidden rounded-full bg-muted">
        {!isLoading &&
          total > 0 &&
          segments.map(
            (s) =>
              s.value > 0 && (
                <div
                  key={s.label}
                  className={`h-full transition-[width] duration-1000 ease-out ${s.color}`}
                  style={{ width: `${(s.value / total) * 100}%` }}
                  title={`${s.label}: ${brl(s.value)}`}
                />
              ),
          )}
      </div>

      <ul className="mt-4 space-y-2 text-sm">
        {segments.slice(0, 3).map((s) => (
          <li key={s.label} className="flex items-center justify-between gap-2">
            <span className="flex items-center gap-2 text-muted-foreground">
              <span className={`h-2 w-2 rounded-full ${s.color}`} />
              {s.label}
            </span>
            {isLoading ? (
              <Skeleton className="h-4 w-20" />
            ) : (
              <span
                className={`font-semibold tabular-nums ${s.value > 0 ? s.text : "text-muted-foreground"}`}
              >
                {brl(s.value)}
              </span>
            )}
          </li>
        ))}
      </ul>
    </DashCard>
  );
}
