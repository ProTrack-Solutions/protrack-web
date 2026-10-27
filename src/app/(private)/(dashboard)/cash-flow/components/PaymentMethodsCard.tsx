"use client";

import { CreditCard } from "lucide-react";
import { CashFlowShare } from "@/interfaces/cash-flow.interface";
import {
  getPaymentMethodColor,
  getPaymentMethodLabel,
} from "@/utils/paymentMethodFormat";
import { DashCard, Skeleton, brl } from "@/components/DashCard";

const pct = (v: number) => `${v.toFixed(1).replace(".", ",")}%`;

interface PaymentMethodsCardProps {
  methods: CashFlowShare[];
  loading: boolean;
}

export function PaymentMethodsCard({
  methods,
  loading,
}: PaymentMethodsCardProps) {
  const rows = methods.filter((m) => m.total > 0);

  return (
    <DashCard
      title="Como você recebeu"
      icon={<CreditCard className="h-4 w-4" />}
      delay={420}
    >
      {loading ? (
        <div className="space-y-3">
          <Skeleton className="h-3 w-full rounded-full" />
          {Array.from({ length: 4 }, (_, i) => (
            <Skeleton key={i} className="h-5 w-full" />
          ))}
        </div>
      ) : rows.length === 0 ? (
        <div className="grid min-h-40 flex-1 place-items-center rounded-xl border border-dashed border-border text-sm text-muted-foreground">
          Nenhuma venda no período.
        </div>
      ) : (
        <>
          {/* barra empilhada: cada forma de pagamento ocupa sua fatia */}
          <div className="flex h-3 gap-0.5 overflow-hidden rounded-full bg-muted">
            {rows.map((m) => (
              <div
                key={m.name}
                className="h-full transition-[width] duration-700 ease-out first:rounded-l-full last:rounded-r-full"
                style={{
                  width: `${m.percentage}%`,
                  backgroundColor: getPaymentMethodColor(m.name),
                }}
                title={`${getPaymentMethodLabel(m.name)}: ${pct(m.percentage)}`}
              />
            ))}
          </div>

          <ul className="mt-4 space-y-2.5 text-sm">
            {rows.map((m) => (
              <li
                key={m.name}
                className="flex items-center justify-between gap-2"
              >
                <span className="flex min-w-0 items-center gap-2">
                  <span
                    className="h-2.5 w-2.5 shrink-0 rounded-full"
                    style={{ backgroundColor: getPaymentMethodColor(m.name) }}
                  />
                  <span className="truncate text-muted-foreground">
                    {getPaymentMethodLabel(m.name)}
                  </span>
                  {m.count ? (
                    <span className="text-xs text-muted-foreground/70">
                      {m.count}×
                    </span>
                  ) : null}
                </span>
                <span className="shrink-0 text-right tabular-nums">
                  <span className="font-semibold text-foreground">
                    {brl(m.total)}
                  </span>
                  <span className="ml-1.5 text-xs text-muted-foreground">
                    {pct(m.percentage)}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </>
      )}
    </DashCard>
  );
}
