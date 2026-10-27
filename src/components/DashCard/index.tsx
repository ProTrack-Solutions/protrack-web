"use client";

import { ReactNode, useEffect, useRef, useState } from "react";
import Link from "next/link";
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

/** `invert`: para métricas em que subir é ruim (ex.: saídas) */
export function TrendBadge({
  value,
  invert = false,
}: {
  value: number | null;
  invert?: boolean;
}) {
  if (value === null || !isFinite(value)) return null;
  const up = value >= 0;
  const good = up !== invert;
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold tabular-nums ${
        good
          ? "bg-secondary/15 text-[hsl(150_45%_32%)]"
          : "bg-destructive/10 text-destructive"
      }`}
    >
      {up ? "▲" : "▼"} {Math.abs(value).toFixed(1).replace(".", ",")}%
    </span>
  );
}

interface KpiProps {
  label: string;
  icon: ReactNode;
  loading: boolean;
  value: number;
  /** Formato do número animado; padrão em reais */
  format?: (value: number) => string;
  footer?: ReactNode;
  href?: string;
  tone: "primary" | "plain";
  accent?: string;
  delay: number;
  children?: ReactNode;
}

/** Card de indicador com número animado; `primary` usa o gradiente da marca */
export function Kpi({
  label,
  icon,
  loading,
  value,
  format = brl,
  footer,
  href,
  tone,
  accent = "text-foreground",
  delay,
  children,
}: KpiProps) {
  const primary = tone === "primary";
  const body = (
    <div
      className={`dash-in group relative h-full overflow-hidden rounded-2xl p-5 transition-all duration-300 hover:-translate-y-0.5 ${
        primary
          ? "bg-[image:var(--gradient-primary)] text-primary-foreground shadow-[var(--shadow-elegant)]"
          : "border border-border/70 bg-card shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-elegant)]"
      }`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between gap-3">
        <p
          className={`text-xs font-semibold uppercase tracking-wider ${
            primary ? "text-primary-foreground/80" : "text-muted-foreground"
          }`}
        >
          {label}
        </p>
        <span
          className={`grid h-9 w-9 place-items-center rounded-xl transition-transform group-hover:scale-110 ${
            primary ? "bg-white/20" : "bg-muted"
          }`}
        >
          {icon}
        </span>
      </div>

      {loading ? (
        <Skeleton className={`mt-3 h-8 w-36 ${primary ? "opacity-40" : ""}`} />
      ) : (
        <p className={`mt-2 text-2xl font-bold ${primary ? "" : accent}`}>
          <AnimatedNumber value={value} format={format} />
        </p>
      )}

      <div
        className={`mt-2 min-h-5 text-xs ${
          primary ? "text-primary-foreground/80" : "text-muted-foreground"
        }`}
      >
        {!loading && footer}
      </div>
      {children}
    </div>
  );

  return href ? (
    <Link
      href={href}
      className="block rounded-2xl focus-visible:outline-2 focus-visible:outline-ring"
    >
      {body}
    </Link>
  ) : (
    body
  );
}

/** Mini gráfico de linha em SVG puro — sem carregar biblioteca de gráficos */
export function Sparkline({
  values,
  className,
}: {
  values: number[];
  className?: string;
}) {
  if (values.length < 2) return null;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const points = values
    .map((v, i) => {
      const x = (i / (values.length - 1)) * 100;
      const y = 28 - ((v - min) / range) * 24;
      return `${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(" ");

  return (
    <svg
      viewBox="0 0 100 32"
      preserveAspectRatio="none"
      aria-hidden="true"
      className={className}
    >
      <polyline
        points={`0,32 ${points} 100,32`}
        fill="currentColor"
        opacity={0.12}
        stroke="none"
      />
      <polyline
        points={points}
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
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
