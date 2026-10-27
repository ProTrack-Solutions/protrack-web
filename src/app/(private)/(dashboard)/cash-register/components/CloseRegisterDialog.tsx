"use client";

import { useState } from "react";
import { Lock } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { brl } from "@/components/DashCard";
import { CashSessionDetail } from "@/interfaces/cash-register.interface";
import { useCashRegisterActions } from "@/hooks/useCashRegister";
import { getApiErrorMessage } from "@/utils/apiError";
import { MoneyInput } from "./MoneyInput";
import { DifferenceBadge } from "./DifferenceBadge";
import { CashComposition } from "./SummaryParts";

interface CloseRegisterDialogProps {
  open: boolean;
  detail: CashSessionDetail;
  onOpenChange: (open: boolean) => void;
  /** Chamado com o id do caixa fechado, para mostrar o relatório */
  onClosed: (id: string) => void;
}

export function CloseRegisterDialog({
  open,
  detail,
  onOpenChange,
  onClosed,
}: CloseRegisterDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        {open && <CloseForm detail={detail} onClosed={onClosed} />}
      </DialogContent>
    </Dialog>
  );
}

function CloseForm({
  detail,
  onClosed,
}: {
  detail: CashSessionDetail;
  onClosed: (id: string) => void;
}) {
  const { close } = useCashRegisterActions();
  const [counted, setCounted] = useState<number | null>(null);
  const [notes, setNotes] = useState("");

  const expected = detail.summary.expected_cash;
  const difference = counted === null ? null : counted - expected;
  const needsNote = difference !== null && Math.abs(difference) >= 0.005;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (counted === null) return;
    close.mutate(
      { counted_cash: counted, notes: notes.trim() || undefined },
      {
        onSuccess: (closed) => {
          toast.success("Caixa fechado.");
          onClosed(closed.session.id);
        },
        onError: (error) =>
          toast.error(getApiErrorMessage(error, "Erro ao fechar o caixa")),
      },
    );
  };

  return (
    <form onSubmit={submit} className="space-y-5">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <Lock className="h-5 w-5 text-primary" />
          Fechar caixa
        </DialogTitle>
        <DialogDescription>
          Conte o dinheiro da gaveta e informe o total. Cartão, Pix e outras
          formas não entram na contagem.
        </DialogDescription>
      </DialogHeader>

      <div className="rounded-xl border border-border/70 bg-muted/30 p-4">
        <CashComposition
          openingAmount={detail.session.opening_amount}
          summary={detail.summary}
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          <label htmlFor="counted-cash" className="text-sm font-semibold">
            Dinheiro contado
          </label>
          {difference !== null && <DifferenceBadge value={difference} />}
        </div>
        <MoneyInput
          id="counted-cash"
          value={counted ?? 0}
          onChange={setCounted}
          autoFocus
        />
        <button
          type="button"
          onClick={() => setCounted(expected)}
          className="cursor-pointer text-xs font-semibold text-primary hover:underline"
        >
          Usar o valor esperado ({brl(expected)})
        </button>
      </div>

      <div className="space-y-2">
        <label htmlFor="closing-notes" className="text-sm font-semibold">
          Observação{" "}
          <span className="font-normal text-muted-foreground">
            {needsNote ? "(explique a diferença)" : "(opcional)"}
          </span>
        </label>
        <textarea
          id="closing-notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          maxLength={500}
          rows={2}
          className="w-full resize-none rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus-visible:border-primary/50 focus-visible:ring-4 focus-visible:ring-primary/15"
        />
      </div>

      <button
        type="submit"
        disabled={counted === null || close.isPending}
        className="inline-flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-primary text-sm font-semibold text-primary-foreground shadow-sm transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <Lock className="h-4 w-4" />
        {close.isPending ? "Fechando..." : "Confirmar fechamento"}
      </button>
    </form>
  );
}
