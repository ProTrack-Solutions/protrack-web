"use client";

import { useMemo } from "react";
import { HandCoins, Receipt, ShoppingBag, TrendingUp } from "lucide-react";
import { GetSalesOverviewResponse } from "@/interfaces/sale.interface";
import {
  Kpi,
  Sparkline,
  TrendBadge,
  brl,
  percentChange,
} from "@/components/DashCard";
import { POSITIVE_TEXT } from "../../cash-flow/components/format";
import { PREVIOUS_LABEL, SalesPeriod, count, plural } from "./format";

interface SalesKpisProps {
  data?: GetSalesOverviewResponse;
  period: SalesPeriod;
  loading: boolean;
}

export function SalesKpis({ data, period, loading }: SalesKpisProps) {
  const totals = data?.totals;
  const previous = data?.previous;

  const revenueSeries = useMemo(
    () => (data?.series ?? []).map((p) => p.revenue),
    [data?.series],
  );
  const countSeries = useMemo(
    () => (data?.series ?? []).map((p) => p.sales_count),
    [data?.series],
  );

  const revenueChange = percentChange(
    totals?.revenue ?? 0,
    previous?.revenue ?? 0,
  );
  const overdue = totals?.overdue_receivable ?? 0;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <Kpi
        tone="primary"
        label="Faturamento"
        icon={<TrendingUp className="h-4 w-4" />}
        loading={loading}
        value={totals?.revenue ?? 0}
        footer={
          period !== "all" &&
          revenueChange !== null &&
          isFinite(revenueChange) ? (
            <span className="tabular-nums">
              {revenueChange >= 0 ? "▲" : "▼"}{" "}
              {Math.abs(revenueChange).toFixed(1).replace(".", ",")}% vs.{" "}
              {PREVIOUS_LABEL[period]} ({brl(previous?.revenue ?? 0)})
            </span>
          ) : period === "all" ? (
            "Total desde a primeira venda"
          ) : (
            "Total das vendas no período"
          )
        }
        delay={0}
      >
        <Sparkline
          values={revenueSeries}
          className="pointer-events-none absolute inset-x-0 bottom-0 h-10 w-full text-white/70"
        />
      </Kpi>

      <Kpi
        tone="plain"
        label="Vendas"
        icon={<ShoppingBag className="h-4 w-4 text-primary" />}
        loading={loading}
        value={totals?.sales_count ?? 0}
        format={count}
        footer={
          <span className="flex items-center gap-2">
            <TrendBadge
              value={percentChange(
                totals?.sales_count ?? 0,
                previous?.sales_count ?? 0,
              )}
            />
            {plural(totals?.items_sold ?? 0, "item", "itens")}
          </span>
        }
        delay={60}
      >
        <Sparkline
          values={countSeries}
          className="pointer-events-none absolute inset-x-0 bottom-0 h-10 w-full text-primary"
        />
      </Kpi>

      <Kpi
        tone="plain"
        label="Ticket médio"
        icon={<Receipt className="h-4 w-4 text-secondary" />}
        loading={loading}
        value={totals?.average_ticket ?? 0}
        footer={
          <span className="flex items-center gap-2">
            <TrendBadge
              value={percentChange(
                totals?.average_ticket ?? 0,
                previous?.average_ticket ?? 0,
              )}
            />
            {plural(totals?.customers_count ?? 0, "cliente", "clientes")}
          </span>
        }
        delay={120}
      />

      <Kpi
        tone="plain"
        label="A receber"
        icon={<HandCoins className="h-4 w-4 text-amber-500" />}
        loading={loading}
        value={totals?.open_receivable ?? 0}
        href="/accounts-receivable"
        footer={
          overdue > 0 ? (
            <span className="font-semibold text-destructive">
              {brl(overdue)} em atraso
            </span>
          ) : (totals?.open_receivable ?? 0) > 0 ? (
            <span className={`font-semibold ${POSITIVE_TEXT}`}>
              Nenhuma parcela em atraso
            </span>
          ) : (
            "Parcelas em aberto das vendas do período"
          )
        }
        delay={180}
      />
    </div>
  );
}
