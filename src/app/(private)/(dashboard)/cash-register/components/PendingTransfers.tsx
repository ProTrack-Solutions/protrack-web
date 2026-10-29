"use client";

import { ArrowDownLeft, ArrowUpRight, Check, Clock, X } from "lucide-react";
import { toast } from "sonner";
import { brl } from "@/components/DashCard";
import {
  CashSessionDetail,
  CashTransferAction,
  PendingCashTransfer,
} from "@/interfaces/cash-register.interface";
import { useCashRegisterActions } from "@/hooks/useCashRegister";
import { getApiErrorMessage } from "@/utils/apiError";
import { formatTime } from "./format";

const DONE: Record<CashTransferAction, string> = {
  accept: "Troco recebido e lançado na gaveta.",
  reject: "Transferência recusada: o dinheiro volta para o caixa de origem.",
  cancel: "Transferência cancelada: o dinheiro voltou para esta gaveta.",
};

function Row({
  transfer,
  incoming,
}: {
  transfer: PendingCashTransfer;
  incoming: boolean;
}) {
  const { resolveTransfer } = useCashRegisterActions();
  const busy =
    resolveTransfer.isPending && resolveTransfer.variables?.id === transfer.id;

  const act = (action: CashTransferAction) =>
    resolveTransfer.mutate(
      { id: transfer.id, action },
      {
        onSuccess: () => toast.success(DONE[action]),
        onError: (error) =>
          toast.error(
            getApiErrorMessage(error, "Erro ao atualizar a transferência"),
          ),
      },
    );

  const button =
    "inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-full px-3 text-xs font-semibold transition-opacity hover:opacity-90 disabled:cursor-wait disabled:opacity-60";

  return (
    <li className="flex flex-wrap items-center gap-3 rounded-xl border border-border/70 bg-card p-3">
      <span
        className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl ${
          incoming
            ? "bg-secondary/15 text-secondary"
            : "bg-amber-500/15 text-amber-600 dark:text-amber-400"
        }`}
      >
        {incoming ? (
          <ArrowDownLeft className="h-4 w-4" />
        ) : (
          <ArrowUpRight className="h-4 w-4" />
        )}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-foreground">
          {incoming
            ? `${transfer.from_register_name} enviou ${brl(transfer.amount)}`
            : `${brl(transfer.amount)} para ${transfer.to_register_name}`}
        </p>
        <p className="truncate text-xs text-muted-foreground">
          {incoming
            ? `Por ${transfer.created_by_name} às ${formatTime(transfer.created_at)}`
            : `Aguardando o ${transfer.to_register_name} aceitar · enviado às ${formatTime(transfer.created_at)}`}
          {transfer.reason ? ` · ${transfer.reason}` : ""}
        </p>
      </div>
      {incoming ? (
        <div className="flex gap-2">
          <button
            type="button"
            disabled={busy}
            onClick={() => act("reject")}
            className={`${button} border border-border bg-card text-muted-foreground hover:text-foreground`}
          >
            <X className="h-3.5 w-3.5" />
            Recusar
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={() => act("accept")}
            className={`${button} bg-secondary text-secondary-foreground`}
          >
            <Check className="h-3.5 w-3.5" />
            Recebi, aceitar
          </button>
        </div>
      ) : (
        <button
          type="button"
          disabled={busy}
          onClick={() => act("cancel")}
          className={`${button} border border-border bg-card text-muted-foreground hover:text-foreground`}
        >
          Cancelar
        </button>
      )}
    </li>
  );
}

/** Troco chegando (aceitar/recusar) e saindo (aguardando) deste caixa */
export function PendingTransfers({ detail }: { detail: CashSessionDetail }) {
  const incoming = detail.incoming_transfers ?? [];
  const outgoing = detail.outgoing_transfers ?? [];
  if (incoming.length === 0 && outgoing.length === 0) return null;

  return (
    <section className="dash-in space-y-2 rounded-2xl border border-amber-500/30 bg-amber-500/5 p-4">
      <h2 className="flex items-center gap-2 text-sm font-semibold text-foreground">
        <Clock className="h-4 w-4 text-amber-600 dark:text-amber-400" />
        Transferências de troco pendentes
      </h2>
      <p className="text-xs text-muted-foreground">
        O caixa só pode ser fechado depois que elas forem aceitas, recusadas ou
        canceladas.
      </p>
      <ul className="space-y-2">
        {incoming.map((t) => (
          <Row key={t.id} transfer={t} incoming />
        ))}
        {outgoing.map((t) => (
          <Row key={t.id} transfer={t} incoming={false} />
        ))}
      </ul>
    </section>
  );
}
