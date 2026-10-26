import {
  CheckCircle2,
  Info,
  LucideIcon,
  TriangleAlert,
  Wrench,
} from "lucide-react";
import {
  AnnouncementType,
  AnnouncementsResponse,
} from "@/interfaces/announcements.interface";

interface AnnouncementTypeStyle {
  label: string;
  icon: LucideIcon;
  /** Barra/realce sólido */
  bar: string;
  /** Fundo suave + cor do ícone */
  soft: string;
  /** Avisos que pedem atenção imediata */
  urgent: boolean;
}

// Mesma ordem de importância usada pelo backend em /announcements/today
export const ANNOUNCEMENT_TYPES: Record<
  AnnouncementType,
  AnnouncementTypeStyle
> = {
  maintenance: {
    label: "Manutenção",
    icon: Wrench,
    bar: "bg-orange-500",
    soft: "bg-orange-500/10 text-orange-600",
    urgent: true,
  },
  warning: {
    label: "Atenção",
    icon: TriangleAlert,
    bar: "bg-destructive",
    soft: "bg-destructive/10 text-destructive",
    urgent: true,
  },
  info: {
    label: "Informativo",
    icon: Info,
    bar: "bg-primary",
    soft: "bg-primary/10 text-primary",
    urgent: false,
  },
  success: {
    label: "Novidade",
    icon: CheckCircle2,
    bar: "bg-secondary",
    soft: "bg-secondary/15 text-[hsl(150_45%_32%)]",
    urgent: false,
  },
};

export const getAnnouncementType = (type: string) =>
  ANNOUNCEMENT_TYPES[type as AnnouncementType] ?? ANNOUNCEMENT_TYPES.info;

/** Datas nulas chegam do backend como o "zero" do Go (ano 0001) */
export function parseAnnouncementDate(value?: string | null) {
  if (!value) return null;
  const date = new Date(value);
  if (isNaN(date.getTime()) || date.getFullYear() < 1971) return null;
  return date;
}

export type AnnouncementStatus = "active" | "scheduled" | "expired";

export function getAnnouncementStatus(
  a: AnnouncementsResponse,
  now = Date.now(),
): AnnouncementStatus {
  const expires = parseAnnouncementDate(a.expires_at);
  if (a.is_active === false || (expires && expires.getTime() <= now))
    return "expired";
  const starts = parseAnnouncementDate(a.starts_at);
  if (starts && starts.getTime() > now) return "scheduled";
  return "active";
}

export const ANNOUNCEMENT_STATUS: Record<
  AnnouncementStatus,
  { label: string; className: string }
> = {
  active: {
    label: "No ar",
    className: "bg-secondary/15 text-[hsl(150_45%_32%)]",
  },
  scheduled: { label: "Agendado", className: "bg-primary/10 text-primary" },
  expired: { label: "Encerrado", className: "bg-muted text-muted-foreground" },
};

const DAY = 24 * 60 * 60 * 1000;

/** "Expira hoje", "Expira em 3 dias", "Começa amanhã"... */
export function getAnnouncementTimeHint(
  a: AnnouncementsResponse,
  now = Date.now(),
) {
  const status = getAnnouncementStatus(a, now);
  if (status === "scheduled") {
    const starts = parseAnnouncementDate(a.starts_at)!;
    const days = Math.ceil((starts.getTime() - now) / DAY);
    return days <= 1 ? "Começa em breve" : `Começa em ${days} dias`;
  }
  if (status === "expired") return null;

  const expires = parseAnnouncementDate(a.expires_at);
  if (!expires) return "Sem data de fim";
  const days = Math.ceil((expires.getTime() - now) / DAY);
  if (days <= 0) return "Expira hoje";
  if (days === 1) return "Expira amanhã";
  return `Expira em ${days} dias`;
}

const relativeFormatter = new Intl.RelativeTimeFormat("pt-BR", {
  numeric: "auto",
});

/** "há 2 dias", "ontem", "agora" */
export function timeAgo(value: string, now = Date.now()) {
  const date = parseAnnouncementDate(value);
  if (!date) return "";
  const diff = (date.getTime() - now) / 1000;
  const abs = Math.abs(diff);
  if (abs < 60) return "agora";
  if (abs < 3600)
    return relativeFormatter.format(Math.round(diff / 60), "minute");
  if (abs < 86400)
    return relativeFormatter.format(Math.round(diff / 3600), "hour");
  if (abs < 86400 * 30)
    return relativeFormatter.format(Math.round(diff / 86400), "day");
  return relativeFormatter.format(Math.round(diff / (86400 * 30)), "month");
}
