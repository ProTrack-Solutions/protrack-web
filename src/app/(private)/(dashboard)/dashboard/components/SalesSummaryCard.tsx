"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, CalendarRange, Target, TrendingUp } from "lucide-react";
import { useSalesSummary } from "@/hooks/useDashboard";
import { AnimatedNumber, DashCard, Skeleton, TrendBadge, brl } from "./shared";

export function SalesSummaryCard() {
  const { data, isLoading } = useSalesSummary();
  const [today] = useState(() => new Date());

  const current = data?.current_month_st ?? 0;
  const previous = data?.last_month_st ?? 0;
  const growth = data?.growth_percentage ?? null;

  // Ritmo do mês: média diária até hoje projetada para o mês inteiro
  const day = today.getDate();
  const daysInMonth = new Date(
    today.getFullYear(),
    today.getMonth() + 1,
    0,
  ).getDate();
  const dailyAverage = current / day;
  const projection = dailyAverage * daysInMonth;
  const monthProgress = (day / daysInMonth) * 100;
  // Quanto do faturamento do mês anterior já foi alcançado
  const vsPrevious = previous > 0 ? (current / previous) * 100 : 0;

  return (
    <DashCard
      className="lg:col-span-2"
      title="Resumo de vendas"
      icon={<TrendingUp className="h-4 w-4" />}
      delay={120}
      action={
        <Link
          href="/sales-list"
          className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
        >
          Ver vendas <ArrowRight className="h-3 w-3" />
        </Link>
      }
    >
      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-10 w-52" />
          <Skeleton className="h-3 w-full" />
          <div className="grid grid-cols-3 gap-3">
            <Skeleton className="h-16" />
            <Skeleton className="h-16" />
            <Skeleton className="h-16" />
          </div>
        </div>
      ) : (
        <>
          <div className="flex flex-wrap items-end gap-x-4 gap-y-2">
            <div>
              <p className="text-xs font-medium text-muted-foreground">
                Vendas do mês
              </p>
              <p className="text-3xl font-bold text-foreground">
                <AnimatedNumber value={current} />
              </p>
            </div>
            <div className="flex items-center gap-2 pb-1 text-xs text-muted-foreground">
              <TrendBadge value={growth} />
              vs. mês anterior
            </div>
          </div>

          {/* barra comparando com o mês anterior */}
          <div className="mt-5">
            <div className="mb-1.5 flex justify-between text-xs text-muted-foreground">
              <span>
                {previous > 0
                  ? `${Math.round(vsPrevious)}% do mês anterior (${brl(previous)})`
                  : "Sem vendas no mês anterior para comparar"}
              </span>
              <span>
                Dia {day} de {daysInMonth}
              </span>
            </div>
            <div className="relative h-2.5 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-[image:var(--gradient-primary)] transition-[width] duration-1000 ease-out"
                style={{ width: `${Math.min(100, vsPrevious)}%` }}
              />
              {/* marcador de quanto do mês já passou */}
              <span
                aria-hidden="true"
                className="absolute top-0 h-full w-0.5 bg-foreground/40"
                style={{ left: `${monthProgress}%` }}
              />
            </div>
          </div>

          <dl className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {[
              {
                icon: CalendarRange,
                label: "Média por dia",
                value: dailyAverage,
              },
              {
                icon: Target,
                label: "Projeção do mês",
                value: projection,
              },
              {
                icon: TrendingUp,
                label: "Mês anterior",
                value: previous,
              },
            ].map((s) => (
              <div key={s.label} className="rounded-xl bg-muted/50 p-3">
                <dt className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <s.icon className="h-3.5 w-3.5" /> {s.label}
                </dt>
                <dd className="mt-1 text-base font-semibold text-foreground">
                  <AnimatedNumber value={s.value} />
                </dd>
              </div>
            ))}
          </dl>
        </>
      )}
    </DashCard>
  );
}
