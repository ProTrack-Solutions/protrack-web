import { BillsPayableStatus } from "@/enum/billsPayableStatus.enum";
import { AccountsReceivable } from "@/interfaces/accounts-receivable.interface";

/** Intervalo mínimo entre lembretes da mesma parcela (mesma regra da API) */
export const REMINDER_COOLDOWN_MS = 24 * 60 * 60 * 1000;

export interface ReminderCapability {
  /** WhatsApp ligado nas configurações da empresa */
  whatsappActive: boolean;
  /** Template de lembrete de parcela a vencer configurado */
  dueTemplateConfigured: boolean;
}

export interface ReceivableActions {
  /** Parcela quitada ou cancelada: nenhuma ação */
  settled: boolean;
  overdue: boolean;
  canSettle: boolean;
  /** "overdue" cobra parcela vencida; "due" avisa a que vai vencer */
  reminderKind: "overdue" | "due";
  canRemind: boolean;
  /** Por que o lembrete está indisponível (vira tooltip do botão) */
  reminderBlockedReason?: string;
  nextReminderAt?: Date;
}

/** "2026-10-27" → "27/10/2026" sem passar por Date (evita voltar um dia por fuso) */
export const formatISODate = (iso: string) => {
  const [y, m, d] = iso.slice(0, 10).split("-");
  return `${d}/${m}/${y}`;
};

const todayISO = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
};

const dateTime = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
});

export const formatDateTime = (date: Date) => dateTime.format(date);

/**
 * Ações liberadas para a parcela conforme o status:
 * - paga / cancelada: nenhuma
 * - pendente / parcial: baixar e lembrete de vencimento (se houver template)
 * - vencida: baixar e cobrança pelo WhatsApp
 */
export function receivableActions(
  account: AccountsReceivable,
  capability: ReminderCapability,
  now = new Date(),
): ReceivableActions {
  const settled =
    account.status === BillsPayableStatus.StatusPaid ||
    account.status === BillsPayableStatus.StatusCanceled ||
    account.balance <= 0;

  // Vencida pelo status ou pela data (antes do job da madrugada atualizar)
  const overdue =
    account.status === BillsPayableStatus.StatusOverdue ||
    account.due_date.slice(0, 10) < todayISO();

  const reminderKind = overdue ? "overdue" : "due";

  if (settled) {
    return { settled, overdue, canSettle: false, reminderKind, canRemind: false };
  }

  let reminderBlockedReason: string | undefined;
  let nextReminderAt: Date | undefined;

  if (account.last_reminder_at) {
    const next = new Date(new Date(account.last_reminder_at).getTime() + REMINDER_COOLDOWN_MS);
    if (next > now) nextReminderAt = next;
  }

  if (!capability.whatsappActive) {
    reminderBlockedReason = "O WhatsApp está desativado em Configurações > Sistema.";
  } else if (reminderKind === "due" && !capability.dueTemplateConfigured) {
    reminderBlockedReason =
      "Configure o template de lembrete de vencimento em Configurações > Sistema para avisar parcelas a vencer.";
  } else if (nextReminderAt) {
    reminderBlockedReason = `Lembrete já enviado. Novo envio a partir de ${formatDateTime(nextReminderAt)}.`;
  }

  return {
    settled,
    overdue,
    canSettle: true,
    reminderKind,
    canRemind: !reminderBlockedReason,
    reminderBlockedReason,
    nextReminderAt,
  };
}
