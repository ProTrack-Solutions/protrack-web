"use client";

import Link from "next/link";
import { CalendarRange, Plus, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/DashCard";
import { useSalesRefresh } from "@/hooks/useSales";
import { Segmented } from "../../cash-flow/components/CashFlowHeader";
import { rangeLabel } from "../../cash-flow/components/format";
import { PERIOD_OPTIONS, SalesPeriod } from "./format";

interface SalesHeaderProps {
  period: SalesPeriod;
  onPeriodChange: (period: SalesPeriod) => void;
  range?: { start: string; end: string };
}

export function SalesHeader({
  period,
  onPeriodChange,
  range,
}: SalesHeaderProps) {
  const { isFetching, refresh } = useSalesRefresh();

  return (
    <div className="dash-in flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Vendas
        </h1>
        <div className="mt-1 flex items-center gap-2 text-muted-foreground">
          <CalendarRange className="h-4 w-4" />
          {range ? (
            rangeLabel(range.start, range.end)
          ) : (
            <Skeleton className="h-4 w-40" />
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Segmented
          label="Período"
          value={period}
          onChange={onPeriodChange}
          options={PERIOD_OPTIONS}
        />
        <button
          type="button"
          onClick={refresh}
          disabled={isFetching}
          aria-label="Atualizar dados"
          className="grid h-9 w-9 cursor-pointer place-items-center rounded-full border border-border bg-card text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:cursor-default"
        >
          <RefreshCw
            className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`}
          />
        </button>
        <Button asChild className="h-9 rounded-full">
          <Link href="/sale">
            <Plus className="h-4 w-4" />
            Nova venda
          </Link>
        </Button>
      </div>
    </div>
  );
}
