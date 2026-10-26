"use client";

import { ReactNode, useEffect, useRef, useState } from "react";
import { formatCurrency } from "@/utils/currencyFormat";

export const brl = (value: number) => `R$ ${formatCurrency(value)}`;

const compactFormatter = new Intl.NumberFormat("pt-BR", {
  notation: "compact",
  maximumFractionDigits: 1,
});

/** "R$ 12,5 mil" — para eixos e rótulos curtos */
export const brlCompact = (value: number) =>
  `R$ ${compactFormatter.format(value)}`;

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Anima um número do valor anterior até o novo com requestAnimationFrame.
 * Escreve direto no textContent do elemento: não re-renderiza o React a cada frame.
 */
export function AnimatedNumber({
  value,
  format = brl,
  duration = 900,
  className,
}: {
  value: number;
  format?: (value: number) => string;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const from = useRef(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const start = from.current;
    from.current = value;

    if (prefersReducedMotion() || start === value) {
      el.textContent = format(value);
      return;
    }

    let frame = 0;
    const t0 = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = format(start + (value - start) * eased);
      if (p < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value, format, duration]);

  return (
    <span ref={ref} className={`tabular-nums ${className ?? ""}`}>
      {format(0)}
    </span>
  );
}

export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`dash-skeleton rounded-md ${className}`}
    />
  );
}

interface DashCardProps {
  title?: ReactNode;
  icon?: ReactNode;
  action?: ReactNode;
  className?: string;
  /** Atraso da animação de entrada, em ms */
  delay?: number;
  children: ReactNode;
}

/** Card padrão do dashboard: cabeçalho com ícone + ação e entrada animada */
export function DashCard({
  title,
  icon,
  action,
  className = "",
  delay = 0,
  children,
}: DashCardProps) {
  return (
    <section
      className={`dash-in flex flex-col rounded-2xl border border-border/70 bg-card p-5 shadow-[var(--shadow-soft)] transition-shadow hover:shadow-[var(--shadow-elegant)] ${className}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {title && (
        <header className="mb-4 flex items-center justify-between gap-3">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-foreground">
            {icon && (
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary/10 text-primary">
                {icon}
              </span>
            )}
            {title}
          </h2>
          {action}
        </header>
      )}
      {children}
    </section>
  );
}

/** Variação percentual entre dois valores; null quando não há base */
export const percentChange = (current: number, previous: number) =>
  previous ? ((current - previous) / Math.abs(previous)) * 100 : null;

export function TrendBadge({ value }: { value: number | null }) {
  if (value === null || !isFinite(value)) return null;
  const up = value >= 0;
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold tabular-nums ${
        up
          ? "bg-secondary/15 text-[hsl(150_45%_32%)]"
          : "bg-destructive/10 text-destructive"
      }`}
    >
      {up ? "▲" : "▼"} {Math.abs(value).toFixed(1).replace(".", ",")}%
    </span>
  );
}

/** Mantém um "agora" que avança sozinho, sem re-renderizar o pai */
export function useNow(intervalMs: number) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), intervalMs);
    return () => window.clearInterval(id);
  }, [intervalMs]);
  return now;
}
