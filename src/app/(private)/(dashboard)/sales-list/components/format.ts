import { format, startOfMonth, subDays } from "date-fns";

export type SalesPeriod = "all" | "today" | "7d" | "30d" | "month" | "90d" | "12m";

export const PERIOD_OPTIONS: { value: SalesPeriod; label: string }[] = [
  { value: "all", label: "Tudo" },
  { value: "today", label: "Hoje" },
  { value: "7d", label: "7 dias" },
  { value: "30d", label: "30 dias" },
  { value: "month", label: "Este mês" },
  { value: "90d", label: "90 dias" },
  { value: "12m", label: "12 meses" },
];

/** Como chamar o período anterior de mesmo tamanho nas comparações */
export const PREVIOUS_LABEL: Record<Exclude<SalesPeriod, "all">, string> = {
  today: "ontem",
  "7d": "7 dias anteriores",
  "30d": "30 dias anteriores",
  month: "período anterior",
  "90d": "90 dias anteriores",
  "12m": "12 meses anteriores",
};

const ymd = (d: Date) => format(d, "yyyy-MM-dd");

export interface SalesRange {
  start_date?: string;
  end_date?: string;
}

/** Datas (fim incluso) do período, pelo calendário do navegador.
 * "Tudo" não manda datas: a API começa na primeira venda */
export function periodRange(period: SalesPeriod, today = new Date()): SalesRange {
  if (period === "all") return {};
  const days: Record<Exclude<SalesPeriod, "month" | "all">, number> = {
    today: 1,
    "7d": 7,
    "30d": 30,
    "90d": 90,
    "12m": 365,
  };
  const start =
    period === "month"
      ? startOfMonth(today)
      : subDays(today, days[period] - 1);
  return { start_date: ymd(start), end_date: ymd(today) };
}

export const count = (n: number) => Math.round(n).toLocaleString("pt-BR");

export const plural = (n: number, one: string, many: string) =>
  `${count(n)} ${n === 1 ? one : many}`;

const dateTime = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "2-digit",
  year: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
});

export const formatDateTime = (iso: string) =>
  dateTime.format(new Date(iso)).replace(",", " ·");
