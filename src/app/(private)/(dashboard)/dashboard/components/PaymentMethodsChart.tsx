"use client";

import { useMemo } from "react";
import { CreditCard } from "lucide-react";
import {
  getPaymentMethodColor,
  getPaymentMethodLabel,
} from "@/utils/paymentMethodFormat";
import { usePaymentMethodsStats } from "@/hooks/useDashboard";
import { DashCard, Skeleton } from "@/components/DashCard";

const pct = (v: number) => `${v.toFixed(1).replace(".", ",")}%`;

// Rosca feita com conic-gradient: zero JS de gráfico e renderização instantânea
export function PaymentMethodsChart() {
  const { data, isLoading } = usePaymentMethodsStats();

  const stats = useMemo(
    () =>
      (Array.isArray(data) ? data : [])
        .filter((s) => s.percentage_method > 0)
        .sort((a, b) => b.percentage_method - a.percentage_method),
    [data],
  );

  const gradient = useMemo(() => {
    const total = stats.reduce((s, m) => s + m.percentage_method, 0) || 1;
    // Ângulo onde cada fatia termina (soma acumulada das porcentagens)
    const ends = stats.reduce<number[]>(
      (acc, m) => [
        ...acc,
        (acc.at(-1) ?? 0) + (m.percentage_method / total) * 360,
      ],
      [],
    );
    const stops = stats.map((m, i) => {
      const start = i === 0 ? 0 : ends[i - 1];
      const end = ends[i];
      // 1.5° de folga entre fatias para separar visualmente
      const gap = Math.max(start, end - 1.5);
      return `${getPaymentMethodColor(m.payment_method)} ${start}deg ${gap}deg, transparent ${gap}deg ${end}deg`;
    });
    return `conic-gradient(${stops.join(", ")})`;
  }, [stats]);

  const top = stats[0];

  return (
    <DashCard
      title="Formas de pagamento"
      icon={<CreditCard className="h-4 w-4" />}
      delay={360}
    >
      {isLoading ? (
        <div className="flex flex-col items-center gap-4">
          <Skeleton className="h-40 w-40 rounded-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
        </div>
      ) : stats.length === 0 ? (
        <div className="grid min-h-48 flex-1 place-items-center rounded-xl border border-dashed border-border text-sm text-muted-foreground">
          Nenhum pagamento registrado.
        </div>
      ) : (
        <>
          <div className="relative mx-auto h-40 w-40">
            <div
              className="dash-donut h-full w-full rounded-full"
              style={{
                background: gradient,
                mask: "radial-gradient(circle, transparent 58%, #000 59%)",
                WebkitMask:
                  "radial-gradient(circle, transparent 58%, #000 59%)",
              }}
            />
            <div className="absolute inset-0 grid place-items-center text-center">
              <div>
                <p className="text-xl font-bold text-foreground">
                  {pct(top.percentage_method)}
                </p>
                <p className="max-w-24 text-xs leading-tight text-muted-foreground">
                  {getPaymentMethodLabel(top.payment_method)}
                </p>
              </div>
            </div>
          </div>

          <ul className="mt-5 space-y-2.5">
            {stats.map((s) => (
              <li key={s.payment_method} className="text-sm">
                <div className="flex items-center justify-between gap-2">
                  <span className="flex min-w-0 items-center gap-2">
                    <span
                      className="h-2.5 w-2.5 shrink-0 rounded-full"
                      style={{
                        backgroundColor: getPaymentMethodColor(
                          s.payment_method,
                        ),
                      }}
                    />
                    <span className="truncate text-muted-foreground">
                      {getPaymentMethodLabel(s.payment_method)}
                    </span>
                  </span>
                  <span className="font-semibold tabular-nums text-foreground">
                    {pct(s.percentage_method)}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </DashCard>
  );
}
