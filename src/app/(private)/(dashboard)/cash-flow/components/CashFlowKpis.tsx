"use client";

import { useMemo } from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
  CalendarClock,
  Scale,
} from "lucide-react";
import { GetCashFlowOverviewResponse } from "@/interfaces/cash-flow.interface";
import {
  Kpi,
  Sparkline,
  TrendBadge,
  brl,
  percentChange,
} from "@/components/DashCard";
import { POSITIVE_TEXT } from "./format";

const plural = (n: number, one: string, many: string) =>
  `${n.toLocaleString("pt-BR")} ${n === 1 ? one : many}`;

interface CashFlowKpisProps {
  data?: GetCashFlowOverviewResponse;
  loading: boolean;
}

export function CashFlowKpis({ data, loading }: CashFlowKpisProps) {
  const totals = data?.totals;
  const previous = data?.previous;
  const forecast = data?.forecast;

  const inflowSeries = useMemo(
    () => (data?.series ?? []).map((p) => p.inflow),
    [data?.series],
  );
  const outflowSeries = useMemo(
    () => (data?.series ?? []).map((p) => p.outflow),
    [data?.series],
  );

  const net = totals?.net ?? 0;
  const netChange = percentChange(net, previous?.net ?? 0);
  const overdue =
    (forecast?.overdue_receivable ?? 0) - (forecast?.overdue_payable ?? 0);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <Kpi
        tone="primary"
        label="Resultado do período"
        icon={<Scale className="h-4 w-4" />}
        loading={loading}
        value={net}
        footer={
          netChange !== null && isFinite(netChange) ? (
            <span className="tabular-nums">
              {netChange >= 0 ? "▲" : "▼"}{" "}
              {Math.abs(netChange).toFixed(1).replace(".", ",")}% vs. período
              anterior ({brl(previous?.net ?? 0)})
            </span>
          ) : (
            "Entradas − saídas no período"
          )
        }
        delay={0}
      />

      <Kpi
        tone="plain"
        label="Entradas"
        icon={<ArrowUpRight className="h-4 w-4 text-secondary" />}
        loading={loading}
        value={totals?.inflow ?? 0}
        accent={POSITIVE_TEXT}
        href="/sales-list"
        footer={
          <span className="flex items-center gap-2">
            <TrendBadge
              value={percentChange(totals?.inflow ?? 0, previous?.inflow ?? 0)}
            />
            {plural(totals?.inflow_count ?? 0, "venda", "vendas")}
          </span>
        }
        delay={60}
      >
        <Sparkline
          values={inflowSeries}
          className="pointer-events-none absolute inset-x-0 bottom-0 h-10 w-full text-secondary"
        />
      </Kpi>

      <Kpi
        tone="plain"
        label="Saídas"
        icon={<ArrowDownRight className="h-4 w-4 text-destructive" />}
        loading={loading}
        value={totals?.outflow ?? 0}
        accent="text-destructive"
        href="/accounts-payable"
        footer={
          <span className="flex items-center gap-2">
            <TrendBadge
              invert
              value={percentChange(
                totals?.outflow ?? 0,
                previous?.outflow ?? 0,
              )}
            />
            {plural(totals?.outflow_count ?? 0, "conta paga", "contas pagas")}
          </span>
        }
        delay={120}
      >
        <Sparkline
          values={outflowSeries}
          className="pointer-events-none absolute inset-x-0 bottom-0 h-10 w-full text-destructive"
        />
      </Kpi>

      <Kpi
        tone="plain"
        label={`Previsto · ${forecast?.days ?? 30} dias`}
        icon={<CalendarClock className="h-4 w-4 text-primary" />}
        loading={loading}
        value={forecast?.net ?? 0}
        accent={
          (forecast?.net ?? 0) < 0 ? "text-destructive" : "text-foreground"
        }
        footer={
          overdue !== 0 ? (
            <span
              className={`font-semibold ${overdue < 0 ? "text-destructive" : POSITIVE_TEXT}`}
            >
              {overdue < 0 ? "−" : "+"}
              {brl(Math.abs(overdue))} em atrasados
            </span>
          ) : (
            "A receber − a pagar com vencimento à frente"
          )
        }
        delay={180}
      />
    </div>
  );
}
