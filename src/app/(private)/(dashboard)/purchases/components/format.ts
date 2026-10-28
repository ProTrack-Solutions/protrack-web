import { brl } from "@/components/DashCard";
import {
  PurchaseBillStatus,
  PurchaseOrderStatus,
} from "@/interfaces/purchases.interface";

export const ORDER_STATUS: Record<
  PurchaseOrderStatus,
  { label: string; className: string }
> = {
  draft: {
    label: "Rascunho",
    className:
      "bg-slate-100 text-slate-700 ring-1 ring-inset ring-slate-300 dark:bg-slate-500/15 dark:text-slate-300 dark:ring-slate-500/30",
  },
  sent: {
    label: "Enviado",
    className:
      "bg-blue-100 text-blue-800 ring-1 ring-inset ring-blue-200 dark:bg-blue-500/15 dark:text-blue-300 dark:ring-blue-500/30",
  },
  partial: {
    label: "Recebido em parte",
    className:
      "bg-amber-100 text-amber-900 ring-1 ring-inset ring-amber-300 dark:bg-amber-500/15 dark:text-amber-300 dark:ring-amber-500/30",
  },
  received: {
    label: "Recebido",
    className:
      "bg-emerald-100 text-emerald-800 ring-1 ring-inset ring-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-300 dark:ring-emerald-500/30",
  },
  closed: {
    label: "Encerrado",
    className:
      "bg-slate-600 text-white ring-1 ring-inset ring-slate-700 dark:bg-slate-500/30 dark:text-slate-200 dark:ring-slate-500/40",
  },
  canceled: {
    label: "Cancelado",
    className:
      "bg-red-100 text-red-800 ring-1 ring-inset ring-red-200 dark:bg-red-500/15 dark:text-red-300 dark:ring-red-500/30",
  },
};

export const STATUS_FILTERS: { value: PurchaseOrderStatus | "all"; label: string }[] = [
  { value: "all", label: "Todos" },
  { value: "draft", label: "Rascunho" },
  { value: "sent", label: "Enviados" },
  { value: "partial", label: "Em parte" },
  { value: "received", label: "Recebidos" },
  { value: "closed", label: "Encerrados" },
  { value: "canceled", label: "Cancelados" },
];

export const BILL_STATUS: Record<PurchaseBillStatus, string> = {
  pending: "Pendente",
  paid: "Paga",
  overdue: "Vencida",
  scheduled: "Agendada",
  canceled: "Cancelada",
  partial: "Paga em parte",
};

/** Valor monetário com o sinal antes do símbolo: "-R$ 10,00" */
export const money = (value: number) =>
  value < 0 ? `-${brl(Math.abs(value))}` : brl(value);

const unitCostFormatter = new Intl.NumberFormat("pt-BR", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 4,
});

/** Custo unitário pode ter até 4 casas (rateio de frete/desconto) */
export const unitMoney = (value: number) =>
  `R$ ${unitCostFormatter.format(value)}`;

export const percent = (value: number) =>
  `${value.toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}%`;

/** Margem sobre o preço de venda */
export const margin = (cost: number, price: number) =>
  price > 0 ? ((price - cost) / price) * 100 : 0;

/** "2026-10-27" → "27/10/2026" */
export const formatDate = (iso: string | null | undefined) => {
  if (!iso) return "—";
  const [y, m, d] = iso.slice(0, 10).split("-");
  return `${d}/${m}/${y}`;
};

const dateTime = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

export const formatDateTime = (iso: string | null | undefined) =>
  iso ? dateTime.format(new Date(iso)) : "—";

/** Date local → "2026-10-27" (sem passar por UTC) */
export function toISODate(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export const todayISO = () => toISODate(new Date());

/** Soma meses mantendo o dia (31/01 + 1 mês → 28/02) */
export function addMonths(iso: string, months: number) {
  const [y, m, d] = iso.split("-").map(Number);
  const target = new Date(y, m - 1 + months, 1);
  const lastDay = new Date(target.getFullYear(), target.getMonth() + 1, 0).getDate();
  target.setDate(Math.min(d, lastDay));
  return toISODate(target);
}

export function addDays(iso: string, days: number) {
  const [y, m, d] = iso.split("-").map(Number);
  return toISODate(new Date(y, m - 1, d + days));
}

/**
 * Divide o total em parcelas iguais em centavos; a diferença do arredondamento
 * vai na última parcela para a soma fechar exatamente.
 */
export function splitInstallments(
  total: number,
  count: number,
  firstDue: string,
  intervalDays: number,
) {
  const cents = Math.round(total * 100);
  const base = Math.floor(cents / count);
  return Array.from({ length: count }, (_, i) => ({
    due_date:
      intervalDays === 30
        ? addMonths(firstDue, i)
        : addDays(firstDue, i * intervalDays),
    amount: (i === count - 1 ? cents - base * (count - 1) : base) / 100,
  }));
}

export const round2 = (value: number) => Math.round(value * 100) / 100;
