"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { BarChart3, Sparkles } from "lucide-react";
import { GetCashFlowOverviewResponse } from "@/interfaces/cash-flow.interface";
import { DashCard, Skeleton, brl } from "@/components/DashCard";
import type { MainChartView } from "./charts";
import { unitLabel } from "./format";

const MainChart = dynamic(() => import("./charts").then((m) => m.MainChart), {
  ssr: false,
  loading: () => <Skeleton className="h-[320px] w-full" />,
});

const VIEWS: { value: MainChartView; label: string }[] = [
  { value: "flow", label: "Entradas × saídas" },
  { value: "net", label: "Resultado" },
];

const NEXT_PERIOD: Record<string, string> = {
  day: "amanhã",
  week: "na próxima semana",
  month: "no próximo mês",
};

interface CashFlowChartCardProps {
  data?: GetCashFlowOverviewResponse;
  loading: boolean;
}

export function CashFlowChartCard({ data, loading }: CashFlowChartCardProps) {
  const [view, setView] = useState<MainChartView>("flow");
  const points = data?.series ?? [];
  const hasMovement = points.some((p) => p.inflow || p.outflow);

  return (
    <DashCard
      className="lg:col-span-2"
      title={
        data
          ? `Movimentação · ${data.quantity} ${unitLabel(data.period, data.quantity)}`
          : "Movimentação"
      }
      icon={<BarChart3 className="h-4 w-4" />}
      delay={240}
      action={
        <div className="inline-flex rounded-full bg-muted p-0.5">
          {VIEWS.map((v) => (
            <button
              key={v.value}
              type="button"
              onClick={() => setView(v.value)}
              aria-pressed={view === v.value}
              className={`cursor-pointer rounded-full px-2.5 py-1 text-xs font-semibold transition-colors ${
                view === v.value
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {v.label}
            </button>
          ))}
        </div>
      }
    >
      <div className="mb-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
        {view === "flow" ? (
          <>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-secondary" /> Entradas
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-destructive" /> Saídas
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-0.5 w-3 rounded-full bg-primary" /> Resultado
              acumulado
            </span>
          </>
        ) : (
          <span>Entradas − saídas em cada período</span>
        )}
        {data && hasMovement && (
          <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 font-medium text-primary">
            <Sparkles className="h-3 w-3" />
            Tendência {NEXT_PERIOD[data.period]}: {brl(data.projection)}
          </span>
        )}
      </div>

      {loading ? (
        <Skeleton className="h-[320px] w-full" />
      ) : !hasMovement ? (
        <div className="grid h-[320px] place-items-center rounded-xl border border-dashed border-border text-sm text-muted-foreground">
          Sem movimentações no período.
        </div>
      ) : (
        <MainChart points={points} period={data!.period} view={view} />
      )}
    </DashCard>
  );
}
