"use client";

import { useMemo } from "react";
import { ArrowDownRight, ArrowUpRight, Scale, Wallet } from "lucide-react";
import {
  useBillsPayableSummary,
  useCashFlowSeries,
  useTotalPayable,
  useTotalReceivable,
} from "@/hooks/useDashboard";
import {
  Kpi,
  Sparkline,
  TrendBadge,
  brl,
  percentChange,
} from "@/components/DashCard";

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
