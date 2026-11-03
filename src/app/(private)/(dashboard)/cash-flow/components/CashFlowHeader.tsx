"use client";

import { CalendarRange, RefreshCw } from "lucide-react";
import { CashFlowPeriod } from "@/interfaces/cash-flow.interface";
import { useCashFlowRefresh } from "@/hooks/useCashFlow";
import { Skeleton } from "@/components/DashCard";
import { PERIOD_OPTIONS, rangeLabel, unitLabel } from "./format";

interface SegmentedProps<T extends string | number> {
  label: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (value: T) => void;
}

export function Segmented<T extends string | number>({
  label,
  value,
  options,
  onChange,
}: SegmentedProps<T>) {
  return (
    <div
      role="radiogroup"
      aria-label={label}
      className="inline-flex rounded-full border border-border bg-card p-1 shadow-[var(--shadow-soft)]"
    >
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(o.value)}
            className={`cursor-pointer rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
              active
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

interface CashFlowHeaderProps {
  period: CashFlowPeriod;
  quantity: number;
  onPeriodChange: (period: CashFlowPeriod) => void;
  onQuantityChange: (quantity: number) => void;
  range?: { start: string; end: string };
}

export function CashFlowHeader({
  period,
  quantity,
  onPeriodChange,
  onQuantityChange,
  range,
}: CashFlowHeaderProps) {
  const { isFetching, refresh } = useCashFlowRefresh();

  return (
    <div className="dash-in flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Fluxo de caixa
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
          label="Agrupar por"
          value={period}
          onChange={onPeriodChange}
          options={(Object.keys(PERIOD_OPTIONS) as CashFlowPeriod[]).map(
            (p) => ({ value: p, label: PERIOD_OPTIONS[p].label }),
          )}
        />
        <Segmented
          label="Quantidade de períodos"
          value={quantity}
          onChange={onQuantityChange}
          options={PERIOD_OPTIONS[period].quantities.map((q) => ({
            value: q,
            label: `${q} ${unitLabel(period, q)}`,
          }))}
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
      </div>
    </div>
  );
}
