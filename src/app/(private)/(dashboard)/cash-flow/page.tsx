"use client";

import { useState } from "react";
import { AlertCircle } from "lucide-react";
import { CashFlowPeriod } from "@/interfaces/cash-flow.interface";
import { useCashFlowOverview } from "@/hooks/useCashFlow";
import { CashFlowHeader } from "./components/CashFlowHeader";
import { CashFlowKpis } from "./components/CashFlowKpis";
import { CashFlowChartCard } from "./components/CashFlowChartCard";
import { ForecastCard } from "./components/ForecastCard";
import { CategoriesCard } from "./components/CategoriesCard";
import { PaymentMethodsCard } from "./components/PaymentMethodsCard";
import { PeriodComparisonCard } from "./components/PeriodComparisonCard";
import { RecentMovementsCard } from "./components/RecentMovementsCard";
import { defaultQuantity } from "./components/format";

// A tela inteira vem de uma única chamada (/cash-flow/overview). Ao trocar o
// filtro os números anteriores continuam na tela, levemente apagados, até os
// novos chegarem: nada de tela de carregamento a cada clique.
export default function CashFlowPage() {
  const [period, setPeriod] = useState<CashFlowPeriod>("day");
  const [quantity, setQuantity] = useState(defaultQuantity("day"));

  const { data, isLoading, isError, isPlaceholderData, refetch } =
    useCashFlowOverview({ period, quantity });

  const changePeriod = (next: CashFlowPeriod) => {
    setPeriod(next);
    setQuantity(defaultQuantity(next));
  };

  return (
    <div className="space-y-6 p-6">
      <CashFlowHeader
        period={period}
        quantity={quantity}
        onPeriodChange={changePeriod}
        onQuantityChange={setQuantity}
        range={data && { start: data.start_date, end: data.end_date }}
      />

      {isError && !data ? (
        <div className="dash-in flex flex-col items-center gap-3 rounded-2xl border border-destructive/30 bg-destructive/5 p-10 text-center">
          <AlertCircle className="h-8 w-8 text-destructive" />
          <p className="font-medium text-foreground">
            Não foi possível carregar o fluxo de caixa.
          </p>
          <button
            type="button"
            onClick={() => refetch()}
            className="cursor-pointer rounded-full bg-primary px-4 py-1.5 text-sm font-semibold text-primary-foreground hover:opacity-90"
          >
            Tentar novamente
          </button>
        </div>
      ) : (
        <div
          aria-busy={isPlaceholderData}
          className={`space-y-6 transition-opacity duration-300 ${
            isPlaceholderData ? "opacity-60" : ""
          }`}
        >
          <CashFlowKpis data={data} loading={isLoading} />

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <CashFlowChartCard data={data} loading={isLoading} />
            <ForecastCard forecast={data?.forecast} loading={isLoading} />
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <CategoriesCard
              inflow={data?.inflow_by_category ?? []}
              outflow={data?.outflow_by_category ?? []}
              loading={isLoading}
            />
            <PaymentMethodsCard
              methods={data?.inflow_by_payment_method ?? []}
              loading={isLoading}
            />
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <RecentMovementsCard
              movements={data?.recent_movements ?? []}
              loading={isLoading}
            />
            <PeriodComparisonCard
              current={data?.totals}
              previous={data?.previous}
              loading={isLoading}
            />
          </div>
        </div>
      )}
    </div>
  );
}
