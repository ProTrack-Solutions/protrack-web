"use client";

import { Trophy } from "lucide-react";
import { useTopProducts } from "@/hooks/useDashboard";
import { DashCard, Skeleton, brl } from "@/components/DashCard";

const medal = ["bg-amber-400", "bg-slate-400", "bg-orange-400"];

// Barras em HTML/CSS: mais informação por produto e nenhum JS de gráfico
export function TopProductsChart() {
  const { data, isLoading } = useTopProducts();
  const products = Array.isArray(data) ? data : [];
  const max = Math.max(1, ...products.map((p) => p.total_sale));

  return (
    <DashCard
      title="Produtos mais vendidos"
      icon={<Trophy className="h-4 w-4" />}
      delay={300}
    >
      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 5 }, (_, i) => (
            <Skeleton key={i} className="h-10" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="grid min-h-48 flex-1 place-items-center rounded-xl border border-dashed border-border text-sm text-muted-foreground">
          Nenhuma venda registrada ainda.
        </div>
      ) : (
        <ol className="space-y-4">
          {products.map((p, i) => {
            const margin =
              p.total_sale > 0
                ? (p.product_real_profit / p.total_sale) * 100
                : 0;
            return (
              <li key={`${p.product_name}-${i}`}>
                <div className="mb-1.5 flex items-center justify-between gap-3 text-sm">
                  <span className="flex min-w-0 items-center gap-2">
                    <span
                      className={`grid h-5 w-5 shrink-0 place-items-center rounded-full text-[10px] font-bold ${
                        medal[i]
                          ? `${medal[i]} text-white`
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {i + 1}
                    </span>
                    <span className="truncate font-medium text-foreground">
                      {p.product_name}
                    </span>
                  </span>
                  <span className="shrink-0 font-semibold tabular-nums text-foreground">
                    {brl(p.total_sale)}
                  </span>
                </div>
                <div className="relative h-2 overflow-hidden rounded-full bg-muted">
                  {/* faturamento */}
                  <div
                    className="dash-bar absolute inset-y-0 left-0 rounded-full bg-primary/35"
                    style={{
                      width: `${(p.total_sale / max) * 100}%`,
                      animationDelay: `${300 + i * 80}ms`,
                    }}
                  />
                  {/* parte que é lucro */}
                  <div
                    className="dash-bar absolute inset-y-0 left-0 rounded-full bg-primary"
                    style={{
                      width: `${(Math.max(0, p.product_real_profit) / max) * 100}%`,
                      animationDelay: `${300 + i * 80}ms`,
                    }}
                  />
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  Lucro {brl(p.product_real_profit)} ·{" "}
                  <span
                    className={
                      margin < 0 ? "text-destructive" : "text-foreground/70"
                    }
                  >
                    margem {margin.toFixed(1).replace(".", ",")}%
                  </span>
                </p>
              </li>
            );
          })}
        </ol>
      )}
    </DashCard>
  );
}
