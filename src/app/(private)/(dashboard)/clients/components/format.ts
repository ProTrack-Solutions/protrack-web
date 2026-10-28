import { CustomerRhythm, DayPeriod } from "@/interfaces/customer-profile.interface";

export { formatDateTime, money } from "../../purchases/components/format";

/** Iniciais para o avatar: primeiro e último nome */
export function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  const first = parts[0][0];
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase();
}

/** Cor estável do avatar a partir do nome */
const AVATAR_COLORS = [
  "bg-blue-100 text-blue-800 dark:bg-blue-500/20 dark:text-blue-200",
  "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-200",
  "bg-amber-100 text-amber-900 dark:bg-amber-500/20 dark:text-amber-200",
  "bg-pink-100 text-pink-800 dark:bg-pink-500/20 dark:text-pink-200",
  "bg-violet-100 text-violet-800 dark:bg-violet-500/20 dark:text-violet-200",
  "bg-cyan-100 text-cyan-800 dark:bg-cyan-500/20 dark:text-cyan-200",
];

export function avatarColor(name: string) {
  let hash = 0;
  for (const ch of name) hash = (hash * 31 + ch.charCodeAt(0)) | 0;
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

/** Data local de um instante (ISO com hora) */
export const formatDay = (iso: string | null | undefined) =>
  iso ? new Date(iso).toLocaleDateString("pt-BR") : "—";

/** "2026-10-27" → "27/10/2026" (dia do calendário, sem fuso) */
export const formatYmd = (ymd: string | null | undefined) => {
  if (!ymd) return "—";
  const [y, m, d] = ymd.slice(0, 10).split("-");
  return `${d}/${m}/${y}`;
};

const dayMs = 86_400_000;

/** "hoje", "ontem", "há 5 dias", "há 3 meses" */
export function relativeDays(iso: string | null | undefined, now: number) {
  if (!iso) return "nunca comprou";
  const days = Math.floor((now - new Date(iso).getTime()) / dayMs);
  if (days <= 0) return "hoje";
  if (days === 1) return "ontem";
  if (days < 30) return `há ${days} dias`;
  const months = Math.floor(days / 30);
  if (months < 12) return `há ${months} ${months === 1 ? "mês" : "meses"}`;
  const years = Math.floor(days / 365);
  return `há ${years} ${years === 1 ? "ano" : "anos"}`;
}

/** Link do WhatsApp com DDI do Brasil quando o número vem sem */
export function whatsappLink(phone: string) {
  const digits = phone.replace(/\D/g, "");
  if (!digits) return null;
  return `https://wa.me/${digits.length <= 11 ? `55${digits}` : digits}`;
}

export const WEEKDAYS = ["domingo", "segunda", "terça", "quarta", "quinta", "sexta", "sábado"];
export const WEEKDAYS_SHORT = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

export const PERIODS: Record<DayPeriod, string> = {
  morning: "manhã",
  afternoon: "tarde",
  evening: "noite",
  night: "madrugada",
};

export const RHYTHM: Record<CustomerRhythm, { label: string; className: string }> = {
  none: {
    label: "Ainda não comprou",
    className: "bg-slate-100 text-slate-700 ring-1 ring-inset ring-slate-300 dark:bg-slate-500/15 dark:text-slate-300 dark:ring-slate-500/30",
  },
  new: {
    label: "Primeira compra",
    className: "bg-blue-100 text-blue-800 ring-1 ring-inset ring-blue-200 dark:bg-blue-500/15 dark:text-blue-300 dark:ring-blue-500/30",
  },
  regular: {
    label: "Comprando no ritmo",
    className: "bg-emerald-100 text-emerald-800 ring-1 ring-inset ring-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-300 dark:ring-emerald-500/30",
  },
  late: {
    label: "Atrasado para voltar",
    className: "bg-amber-100 text-amber-900 ring-1 ring-inset ring-amber-300 dark:bg-amber-500/15 dark:text-amber-300 dark:ring-amber-500/30",
  },
  away: {
    label: "Sumido",
    className: "bg-red-100 text-red-800 ring-1 ring-inset ring-red-200 dark:bg-red-500/15 dark:text-red-300 dark:ring-red-500/30",
  },
};
