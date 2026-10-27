"use client";

import { useMemo } from "react";
import { Tags } from "lucide-react";
import { CashFlowShare } from "@/interfaces/cash-flow.interface";
import { DashCard, Skeleton, brl } from "@/components/DashCard";

const MAX_ROWS = 5;
const pct = (v: number) => `${v.toFixed(1).replace(".", ",")}%`;

/** Mantém as maiores categorias e soma o resto em "Outras" */
function topWithOthers(items: CashFlowShare[]) {
  const sorted = items.filter((c) => c.total > 0);
  if (sorted.length <= MAX_ROWS) return sorted;
  const rest = sorted.slice(MAX_ROWS - 1);
  return [
    ...sorted.slice(0, MAX_ROWS - 1),
    {
      name: `Outras (${rest.length})`,
      total: rest.reduce((s, c) => s + c.total, 0),
      percentage: rest.reduce((s, c) => s + c.percentage, 0),
    },
  ];
}

function CategoryList({
  title,
  items,
  barClass,
  loading,
  empty,
}: {
  title: string;
  items: CashFlowShare[];
  barClass: string;
  loading: boolean;
  empty: string;
}) {
  const rows = useMemo(() => topWithOthers(items), [items]);
  const max = Math.max(...rows.map((r) => r.percentage), 1);

  return (
    <div>
      <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {title}
      </h3>
      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 4 }, (_, i) => (
            <Skeleton key={i} className="h-8 w-full" />
          ))}
        </div>
      ) : rows.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border py-8 text-center text-sm text-muted-foreground">
          {empty}
        </p>
      ) : (
        <ul className="space-y-3.5">
          {rows.map((r, i) => (
            <li key={r.name} className="text-sm">
              <div className="mb-1 flex items-baseline justify-between gap-2">
                <span className="truncate font-medium text-foreground">
                  {r.name}
                </span>
                <span className="shrink-0 tabular-nums text-muted-foreground">
                  <span className="font-semibold text-foreground">
                    {brl(r.total)}
                  </span>{" "}
                  · {pct(r.percentage)}
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-muted">
                <div
                  className={`dash-bar h-full rounded-full transition-[width] duration-700 ease-out ${barClass}`}
                  style={{
                    width: `${(r.percentage / max) * 100}%`,
                    animationDelay: `${i * 60}ms`,
                  }}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

interface CategoriesCardProps {
  inflow: CashFlowShare[];
  outflow: CashFlowShare[];
  loading: boolean;
}

export function CategoriesCard({
  inflow,
  outflow,
  loading,
}: CategoriesCardProps) {
  return (
    <DashCard
      className="lg:col-span-2"
      title="Por categoria"
      icon={<Tags className="h-4 w-4" />}
      delay={360}
    >
      <div className="grid gap-6 sm:grid-cols-2">
        <CategoryList
          title="Entradas · produtos vendidos"
          items={inflow}
          barClass="bg-secondary"
          loading={loading}
          empty="Nenhuma venda no período."
        />
        <CategoryList
          title="Saídas · contas pagas"
          items={outflow}
          barClass="bg-destructive"
          loading={loading}
          empty="Nenhuma conta paga no período."
        />
      </div>
    </DashCard>
  );
}
