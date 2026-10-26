"use client";

import Link from "next/link";
import { ArrowRight, Package } from "lucide-react";
import { useInventoryTurnover, useStockValue } from "@/hooks/useDashboard";
import { AnimatedNumber, DashCard, Skeleton } from "./shared";

// Faixas de leitura do giro para dar contexto ao número
function turnoverInsight(turnover: number) {
  if (turnover >= 60)
    return {
      label: "Giro alto",
      tone: "text-[hsl(150_45%_32%)] bg-secondary/15",
      hint: "Seu estoque está saindo rápido — fique de olho na reposição.",
    };
  if (turnover >= 25)
    return {
      label: "Giro saudável",
      tone: "text-primary bg-primary/10",
      hint: "O estoque está girando em bom ritmo.",
    };
  return {
    label: "Giro baixo",
    tone: "text-amber-700 bg-amber-100",
    hint: "Produtos parados por muito tempo prendem dinheiro.",
  };
}

export function StockValueCard() {
  const stock = useStockValue();
  const turnover = useInventoryTurnover();

  const turnoverValue = turnover.data?.inventory_turnover ?? 0;
  const insight = turnoverInsight(turnoverValue);

  return (
    <DashCard
      title="Estoque"
      icon={<Package className="h-4 w-4" />}
      delay={420}
      action={
        <Link
          href="/stock"
          className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
        >
          Ver estoque <ArrowRight className="h-3 w-3" />
        </Link>
      }
    >
      <p className="text-xs font-medium text-muted-foreground">
        Total investido
      </p>
      {stock.isLoading ? (
        <Skeleton className="mt-1 h-8 w-40" />
      ) : (
        <p className="text-2xl font-bold text-foreground">
          <AnimatedNumber value={stock.data?.cost_total ?? 0} />
        </p>
      )}

      <div className="mt-6">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Giro de estoque</span>
          {turnover.isLoading ? (
            <Skeleton className="h-5 w-12" />
          ) : (
            <span className="font-semibold tabular-nums">{turnoverValue}%</span>
          )}
        </div>
        <div className="h-2.5 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-[image:var(--gradient-secondary)] transition-[width] duration-1000 ease-out"
            style={{ width: `${Math.min(100, Math.max(0, turnoverValue))}%` }}
          />
        </div>
        {!turnover.isLoading && (
          <div className="mt-3 rounded-xl bg-muted/50 p-3">
            <span
              className={`rounded-full px-2 py-0.5 text-xs font-semibold ${insight.tone}`}
            >
              {insight.label}
            </span>
            <p className="mt-1.5 text-xs text-muted-foreground">
              {insight.hint}
            </p>
          </div>
        )}
      </div>
    </DashCard>
  );
}
