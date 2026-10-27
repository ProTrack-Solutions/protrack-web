"use client";

import Link from "next/link";
import {
  ArrowDownLeft,
  ArrowRight,
  ArrowUpRight,
  ReceiptText,
} from "lucide-react";
import { CashFlowMovement } from "@/interfaces/cash-flow.interface";
import { getPaymentMethodLabel } from "@/utils/paymentMethodFormat";
import { DashCard, Skeleton, brl, useNow } from "@/components/DashCard";
import { POSITIVE_TEXT } from "./format";

const timeFormatter = new Intl.DateTimeFormat("pt-BR", {
  hour: "2-digit",
  minute: "2-digit",
});
const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "short",
});

const startOfDay = (d: Date) =>
  new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();

function whenLabel(movement: CashFlowMovement, now: number) {
  const d = new Date(movement.occurred_at);
  const days = Math.round(
    (startOfDay(new Date(now)) - startOfDay(d)) / 86_400_000,
  );
  // Contas pagas só têm a data do pagamento: não mostra horário para elas
  const time =
    movement.kind === "inflow" ? ` · ${timeFormatter.format(d)}` : "";
  if (days === 0) return `Hoje${time}`;
  if (days === 1) return `Ontem${time}`;
  return dateFormatter.format(d).replace(".", "");
}

interface RecentMovementsCardProps {
  movements: CashFlowMovement[];
  loading: boolean;
}

export function RecentMovementsCard({
  movements,
  loading,
}: RecentMovementsCardProps) {
  const now = useNow(60_000);

  return (
    <DashCard
      className="lg:col-span-2"
      title="Últimas movimentações"
      icon={<ReceiptText className="h-4 w-4" />}
      delay={540}
      action={
        <div className="flex gap-3">
          <Link
            href="/sales-list"
            className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
          >
            Vendas <ArrowRight className="h-3 w-3" />
          </Link>
          <Link
            href="/accounts-payable"
            className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
          >
            Contas <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      }
    >
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }, (_, i) => (
            <Skeleton key={i} className="h-11 w-full" />
          ))}
        </div>
      ) : movements.length === 0 ? (
        <div className="grid min-h-40 place-items-center rounded-xl border border-dashed border-border text-sm text-muted-foreground">
          Nenhuma movimentação registrada ainda.
        </div>
      ) : (
        <ul className="-mx-2 divide-y divide-border/60">
          {movements.map((m) => {
            const inflow = m.kind === "inflow";
            return (
              <li
                key={`${m.kind}-${m.id}`}
                className="flex items-center gap-3 rounded-lg px-2 py-2.5 transition-colors hover:bg-muted/50"
              >
                <span
                  className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl ${
                    inflow
                      ? "bg-secondary/15 text-secondary"
                      : "bg-destructive/10 text-destructive"
                  }`}
                >
                  {inflow ? (
                    <ArrowUpRight className="h-4 w-4" />
                  ) : (
                    <ArrowDownLeft className="h-4 w-4" />
                  )}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">
                    {m.description}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {inflow
                      ? `Venda · ${getPaymentMethodLabel(m.detail)}`
                      : m.detail}
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <p
                    className={`text-sm font-semibold tabular-nums ${
                      inflow ? POSITIVE_TEXT : "text-destructive"
                    }`}
                  >
                    {inflow ? "+" : "−"} {brl(m.amount)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {whenLabel(m, now)}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </DashCard>
  );
}
