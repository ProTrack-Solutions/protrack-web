"use client";

import { ReactNode, useMemo } from "react";
import Link from "next/link";
import { ArrowDownRight, ArrowUpRight, Scale, Wallet } from "lucide-react";
import {
  useBillsPayableSummary,
  useCashFlowSeries,
  useTotalPayable,
  useTotalReceivable,
} from "@/hooks/useDashboard";
import {
  AnimatedNumber,
  Skeleton,
  TrendBadge,
  brl,
  percentChange,
} from "./shared";

/** Mini gráfico de linha em SVG puro — sem carregar biblioteca de gráficos */
function Sparkline({
  values,
  className,
}: {
  values: number[];
  className?: string;
}) {
  if (values.length < 2) return null;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const points = values
    .map((v, i) => {
      const x = (i / (values.length - 1)) * 100;
      const y = 28 - ((v - min) / range) * 24;
      return `${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(" ");

  return (
    <svg
      viewBox="0 0 100 32"
      preserveAspectRatio="none"
      aria-hidden="true"
      className={className}
    >
      <polyline
        points={`0,32 ${points} 100,32`}
        fill="currentColor"
        opacity={0.12}
        stroke="none"
      />
      <polyline
        points={points}
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

interface KpiProps {
  label: string;
  icon: ReactNode;
  loading: boolean;
  value: number;
  footer?: ReactNode;
  href?: string;
  tone: "primary" | "plain";
  accent?: string;
  delay: number;
  children?: ReactNode;
}

function Kpi({
  label,
  icon,
  loading,
  value,
  footer,
  href,
  tone,
  accent = "text-foreground",
  delay,
  children,
}: KpiProps) {
  const primary = tone === "primary";
  const body = (
    <div
      className={`dash-in group relative h-full overflow-hidden rounded-2xl p-5 transition-all duration-300 hover:-translate-y-0.5 ${
        primary
          ? "bg-[image:var(--gradient-primary)] text-primary-foreground shadow-[var(--shadow-elegant)]"
          : "border border-border/70 bg-card shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-elegant)]"
      }`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between gap-3">
        <p
          className={`text-xs font-semibold uppercase tracking-wider ${
            primary ? "text-primary-foreground/80" : "text-muted-foreground"
          }`}
        >
          {label}
        </p>
        <span
          className={`grid h-9 w-9 place-items-center rounded-xl transition-transform group-hover:scale-110 ${
            primary ? "bg-white/20" : "bg-muted"
          }`}
        >
          {icon}
        </span>
      </div>

      {loading ? (
        <Skeleton className={`mt-3 h-8 w-36 ${primary ? "opacity-40" : ""}`} />
      ) : (
        <p className={`mt-2 text-2xl font-bold ${primary ? "" : accent}`}>
          <AnimatedNumber value={value} />
        </p>
      )}

      <div
        className={`mt-2 min-h-5 text-xs ${
          primary ? "text-primary-foreground/80" : "text-muted-foreground"
        }`}
      >
        {!loading && footer}
      </div>
      {children}
    </div>
  );

  return href ? (
    <Link
      href={href}
      className="block rounded-2xl focus-visible:outline-2 focus-visible:outline-ring"
    >
      {body}
    </Link>
  ) : (
    body
  );
}

export function KpiCards() {
  const receivable = useTotalReceivable();
  const payable = useTotalPayable();
  const billsSummary = useBillsPayableSummary();
  const cashFlow = useCashFlowSeries();

  // Resultado (entradas − saídas) de cada mês da série do fluxo de caixa
  const netSeries = useMemo(
    () => (cashFlow.data ?? []).map((m) => m.total_inflow - m.total_outflow),
    [cashFlow.data],
  );
  const currentNet = netSeries.at(-1) ?? 0;
  const previousNet = netSeries.at(-2) ?? 0;

  const receivableValue = receivable.data ?? 0;
  const payableValue = payable.data ?? 0;
  const overdue = billsSummary.data?.total_overdue ?? 0;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <Kpi
        tone="primary"
        label="Saldo previsto"
        icon={<Scale className="h-4 w-4" />}
        loading={receivable.isLoading || payable.isLoading}
        value={receivableValue - payableValue}
        footer="O que você tem a receber menos o que tem a pagar"
        delay={0}
      />

      <Kpi
        tone="plain"
        label="Resultado do mês"
        icon={<Wallet className="h-4 w-4 text-primary" />}
        loading={cashFlow.isLoading}
        value={currentNet}
        accent={currentNet < 0 ? "text-destructive" : "text-foreground"}
        href="/cash-flow"
        footer={
          <span className="flex items-center gap-2">
            <TrendBadge value={percentChange(currentNet, previousNet)} />
            entradas − saídas
          </span>
        }
        delay={60}
      >
        <Sparkline
          values={netSeries}
          className="pointer-events-none absolute inset-x-0 bottom-0 h-10 w-full text-primary"
        />
      </Kpi>

      <Kpi
        tone="plain"
        label="A receber"
        icon={<ArrowUpRight className="h-4 w-4 text-secondary" />}
        loading={receivable.isLoading}
        value={receivableValue}
        accent="text-[hsl(150_45%_35%)]"
        href="/accounts-receivable"
        footer="Parcelas e vendas em aberto"
        delay={120}
      />

      <Kpi
        tone="plain"
        label="A pagar"
        icon={<ArrowDownRight className="h-4 w-4 text-destructive" />}
        loading={payable.isLoading}
        value={payableValue}
        accent="text-destructive"
        href="/accounts-payable"
        footer={
          overdue > 0 ? (
            <span className="font-semibold text-destructive">
              {brl(overdue)} vencido
            </span>
          ) : (
            "Nenhuma conta vencida"
          )
        }
        delay={180}
      />
    </div>
  );
}
