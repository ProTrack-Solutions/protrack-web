import { brl } from "@/components/DashCard";
import { ReportCell, ReportColumnType } from "@/interfaces/reports.interface";

export type PeriodPreset =
  | "today"
  | "yesterday"
  | "last_7"
  | "last_30"
  | "this_month"
  | "last_month"
  | "this_year"
  | "custom";

export const PERIOD_PRESETS: { value: PeriodPreset; label: string }[] = [
  { value: "today", label: "Hoje" },
  { value: "yesterday", label: "Ontem" },
  { value: "last_7", label: "7 dias" },
  { value: "last_30", label: "30 dias" },
  { value: "this_month", label: "Este mês" },
  { value: "last_month", label: "Mês passado" },
  { value: "this_year", label: "Este ano" },
  { value: "custom", label: "Personalizado" },
];

/** Date local → "2026-10-27" (sem passar por UTC) */
export function toISODate(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/** Intervalo [início, fim] (ambos inclusivos) de cada atalho de período */
export function presetRange(
  preset: Exclude<PeriodPreset, "custom">,
  today = new Date(),
) {
  const y = today.getFullYear();
  const m = today.getMonth();
  const d = today.getDate();
  const range = (start: Date, end: Date) => ({
    start: toISODate(start),
    end: toISODate(end),
  });

  switch (preset) {
    case "today":
      return range(today, today);
    case "yesterday":
      return range(new Date(y, m, d - 1), new Date(y, m, d - 1));
    case "last_7":
      return range(new Date(y, m, d - 6), today);
    case "last_30":
      return range(new Date(y, m, d - 29), today);
    case "last_month":
      return range(new Date(y, m - 1, 1), new Date(y, m, 0));
    case "this_year":
      return range(new Date(y, 0, 1), today);
    default:
      return range(new Date(y, m, 1), today);
  }
}

/** "2026-10-27" → "27/10/2026" */
export const formatISODate = (iso: string) => {
  const [y, m, d] = iso.slice(0, 10).split("-");
  return `${d}/${m}/${y}`;
};

const numberFormatter = new Intl.NumberFormat("pt-BR", {
  maximumFractionDigits: 2,
});
const percentFormatter = new Intl.NumberFormat("pt-BR", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

/** Valor monetário com o sinal antes do símbolo: "-R$ 10,00" */
export const money = (value: number) =>
  value < 0 ? `-${brl(Math.abs(value))}` : brl(value);

export const percent = (value: number) => `${percentFormatter.format(value)}%`;

export function formatValue(value: number, type: ReportColumnType) {
  switch (type) {
    case "money":
      return money(value);
    case "percent":
      return percent(value);
    default:
      return numberFormatter.format(value);
  }
}

const ISO_DATE = /^\d{4}-\d{2}-\d{2}/;

/**
 * Formata uma célula pelo tipo da coluna. Datas chegam em ISO já no fuso da
 * empresa: usa o texto direto, sem `new Date`, para o navegador não converter.
 */
export function formatCell(value: ReportCell, type: ReportColumnType) {
  if (value === null || value === undefined || value === "") return "";
  if (typeof value === "string") {
    // Rótulos como "Total" podem cair numa coluna de data: só formata ISO
    if (!ISO_DATE.test(value)) return value;
    if (type === "date") return formatISODate(value);
    if (type === "datetime") {
      return `${formatISODate(value)} ${value.slice(11, 16)}`;
    }
    return value;
  }
  if (typeof value === "boolean") return value ? "Sim" : "Não";
  return formatValue(value, type);
}

export const isNumericColumn = (type: ReportColumnType) =>
  type === "money" || type === "number" || type === "percent";

/** Comparação para ordenar a tabela: nulos sempre por último */
export function compareCells(a: ReportCell, b: ReportCell) {
  if (a === b) return 0;
  if (a === null || a === "") return 1;
  if (b === null || b === "") return -1;
  if (typeof a === "number" && typeof b === "number") return a - b;
  return String(a).localeCompare(String(b), "pt-BR", { numeric: true });
}
