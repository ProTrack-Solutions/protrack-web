import { CashFlowPeriod } from "@/interfaces/cash-flow.interface";

export const POSITIVE_TEXT = "text-[hsl(150_45%_35%)]";

/** Opções de "quantos períodos" para cada granularidade; o índice 1 é o padrão */
export const PERIOD_OPTIONS: Record<
  CashFlowPeriod,
  { label: string; unit: [string, string]; quantities: number[] }
> = {
  day: { label: "Diário", unit: ["dia", "dias"], quantities: [7, 30, 90] },
  week: {
    label: "Semanal",
    unit: ["semana", "semanas"],
    quantities: [4, 12, 26],
  },
  month: { label: "Mensal", unit: ["mês", "meses"], quantities: [3, 6, 12] },
};

export const defaultQuantity = (period: CashFlowPeriod) =>
  PERIOD_OPTIONS[period].quantities[1];

export const unitLabel = (period: CashFlowPeriod, quantity: number) =>
  PERIOD_OPTIONS[period].unit[quantity === 1 ? 0 : 1];

/** "2026-10-27" → Date local (sem o deslocamento de fuso do `new Date(iso)`) */
export function parseDate(date: string) {
  const [y, m, d] = date.split("-").map(Number);
  return new Date(y, m - 1, d);
}

const dayMonth = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "2-digit",
});
const shortMonth = new Intl.DateTimeFormat("pt-BR", {
  month: "short",
  year: "2-digit",
});
const longDay = new Intl.DateTimeFormat("pt-BR", {
  day: "numeric",
  month: "short",
});
const fullDay = new Intl.DateTimeFormat("pt-BR", {
  weekday: "short",
  day: "numeric",
  month: "short",
});

const clean = (s: string) => s.replace(/\./g, "").replace(" de ", "/");

/** Rótulo curto do eixo X para o início de cada período */
export function bucketLabel(date: string, period: CashFlowPeriod) {
  const d = parseDate(date);
  if (period === "month") return clean(shortMonth.format(d));
  return dayMonth.format(d);
}

/** Rótulo completo do período, usado no tooltip */
export function bucketTitle(date: string, period: CashFlowPeriod) {
  const d = parseDate(date);
  if (period === "month") {
    return new Intl.DateTimeFormat("pt-BR", {
      month: "long",
      year: "numeric",
    }).format(d);
  }
  if (period === "week") {
    const end = new Date(d);
    end.setDate(d.getDate() + 6);
    return `Semana de ${clean(longDay.format(d))} a ${clean(longDay.format(end))}`;
  }
  return fullDay.format(d).replace(/\./g, "");
}

/** "28 set – 27 out 2026" */
export function rangeLabel(start: string, end: string) {
  const s = parseDate(start);
  const e = parseDate(end);
  return `${clean(longDay.format(s))} – ${clean(longDay.format(e))} ${e.getFullYear()}`;
}
