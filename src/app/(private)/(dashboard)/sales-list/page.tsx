"use client";

import { useMemo, useState } from "react";
import { AlertCircle } from "lucide-react";
import { useSalesOverview } from "@/hooks/useSales";
import { SalesHeader } from "./components/SalesHeader";
import { SalesKpis } from "./components/SalesKpis";
import { SalesTable } from "./components/SalesTable";
import { SalesPeriod, periodRange } from "./components/format";

// Os cards vêm de /sales/overview e a lista usa o mesmo período. Ao trocar o filtro os números anteriores ficam na tela, levemente
// apagados, até os novos chegarem.
export default function SalesListPage() {
  const [period, setPeriod] = useState<SalesPeriod>("all");
  const range = useMemo(() => periodRange(period), [period]);

  const { data, isLoading, isError, isPlaceholderData, refetch } =
    useSalesOverview(range);

  return (
    <div className="space-y-6 p-6">
      <SalesHeader
        period={period}
        onPeriodChange={setPeriod}
        range={data && { start: data.start_date, end: data.end_date }}
      />

      {isError && !data ? (
        <div className="dash-in flex flex-col items-center gap-3 rounded-2xl border border-destructive/30 bg-destructive/5 p-10 text-center">
          <AlertCircle className="h-8 w-8 text-destructive" />
          <p className="font-medium text-foreground">
            Não foi possível carregar os indicadores de vendas.
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
          className={`transition-opacity duration-300 ${
            isPlaceholderData ? "opacity-60" : ""
          }`}
        >
          <SalesKpis data={data} period={period} loading={isLoading} />
        </div>
      )}

      <SalesTable range={range} />
    </div>
  );
}
