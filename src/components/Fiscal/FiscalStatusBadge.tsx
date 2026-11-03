"use client";

import {
  AlertTriangle,
  Ban,
  CheckCircle2,
  CloudOff,
  Loader2,
  XCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  FiscalDocument,
  FiscalDocumentStatus,
} from "@/interfaces/fiscal.interface";

const STYLE: Record<
  FiscalDocumentStatus,
  { label: string; className: string; icon: typeof CheckCircle2 }
> = {
  AUTHORIZED: {
    label: "Autorizada",
    className:
      "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300",
    icon: CheckCircle2,
  },
  CONTINGENCY: {
    label: "Contingência",
    className:
      "border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-500/30 dark:bg-sky-500/10 dark:text-sky-300",
    icon: CloudOff,
  },
  PENDING: {
    label: "Enviando",
    className:
      "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300",
    icon: Loader2,
  },
  PROCESSING: {
    label: "Na SEFAZ",
    className:
      "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300",
    icon: Loader2,
  },
  SUPERSEDED: {
    label: "Substituída",
    className: "border-border bg-muted text-muted-foreground",
    icon: CloudOff,
  },
  REJECTED: {
    label: "Rejeitada",
    className:
      "border-red-200 bg-red-50 text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300",
    icon: XCircle,
  },
  FAILED: {
    label: "Não emitida",
    className:
      "border-red-200 bg-red-50 text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300",
    icon: AlertTriangle,
  },
  ERROR: {
    label: "Erro",
    className:
      "border-red-200 bg-red-50 text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300",
    icon: AlertTriangle,
  },
  CANCELLED: {
    label: "Cancelada",
    className: "border-border bg-muted text-muted-foreground",
    icon: Ban,
  },
};

interface Props {
  document: Pick<FiscalDocument, "status" | "number" | "environment"> | null;
  /** Mostra o número da nota ao lado */
  showNumber?: boolean;
  className?: string;
}

/** Situação da NFC-e da venda */
export function FiscalStatusBadge({ document, showNumber, className }: Props) {
  if (!document) {
    return (
      <span className={cn("text-xs text-muted-foreground", className)}>
        Sem nota
      </span>
    );
  }
  const style = STYLE[document.status] ?? STYLE.ERROR;
  const Icon = style.icon;
  const spinning =
    document.status === "PENDING" || document.status === "PROCESSING";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 whitespace-nowrap rounded-full border px-2 py-0.5 text-xs font-medium",
        style.className,
        className,
      )}
    >
      <Icon className={cn("h-3 w-3", spinning && "animate-spin")} />
      {style.label}
      {showNumber && document.number ? ` nº ${document.number}` : ""}
      {document.environment === "test" && (
        <span className="ml-0.5 rounded bg-black/10 px-1 text-[10px] uppercase dark:bg-white/10">
          teste
        </span>
      )}
    </span>
  );
}
