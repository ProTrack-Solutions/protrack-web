"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { brl } from "@/components/DashCard";
import { CashMovementType } from "@/interfaces/cash-register.interface";
import { useCashRegisterActions } from "@/hooks/useCashRegister";
import { getApiErrorMessage } from "@/utils/apiError";
import { MoneyInput } from "./MoneyInput";

const COPY: Record<
  CashMovementType,
  { title: string; description: string; placeholder: string; action: string }
> = {
  withdrawal: {
    title: "Sangria",
    description: "Retirada de dinheiro da gaveta (depósito, pagamento, cofre).",
    placeholder: "Ex.: depósito no banco",
    action: "Registrar sangria",
  },
  supply: {
    title: "Suprimento",
    description: "Reforço de dinheiro na gaveta, normalmente para troco.",
    placeholder: "Ex.: reforço de troco",
    action: "Registrar suprimento",
  },
};

interface MovementDialogProps {
  type: CashMovementType | null;
  expectedCash: number;
  onOpenChange: (open: boolean) => void;
}

export function MovementDialog({
  type,
  expectedCash,
  onOpenChange,
}: MovementDialogProps) {
  return (
    <Dialog open={type !== null} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        {/* Remonta o formulário a cada abertura para começar limpo */}
        {type && (
          <MovementForm
            key={type}
            type={type}
            expectedCash={expectedCash}
            onDone={() => onOpenChange(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

function MovementForm({
  type,
  expectedCash,
  onDone,
}: {
  type: CashMovementType;
  expectedCash: number;
  onDone: () => void;
}) {
  const { move } = useCashRegisterActions();
  const [amount, setAmount] = useState(0);
  const [reason, setReason] = useState("");
  const copy = COPY[type];
  const tooMuch = type === "withdrawal" && amount > expectedCash;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    move.mutate(
      { type, amount, reason: reason.trim() || undefined },
      {
        onSuccess: () => {
          toast.success(`${copy.title} de ${brl(amount)} registrada.`);
          onDone();
        },
        onError: (error) =>
          toast.error(getApiErrorMessage(error, "Erro ao registrar")),
      },
    );
  };

  return (
    <form onSubmit={submit} className="space-y-5">
      <DialogHeader>
        <DialogTitle>{copy.title}</DialogTitle>
        <DialogDescription>{copy.description}</DialogDescription>
      </DialogHeader>

      <div className="space-y-2">
        <label htmlFor="movement-amount" className="text-sm font-semibold">
          Valor
        </label>
        <MoneyInput
          id="movement-amount"
          value={amount}
          onChange={setAmount}
          autoFocus
        />
        <p
          className={`text-xs ${tooMuch ? "font-semibold text-destructive" : "text-muted-foreground"}`}
        >
          {type === "withdrawal" &&
            (tooMuch
              ? `Maior que o dinheiro esperado na gaveta (${brl(expectedCash)}).`
              : `Esperado na gaveta agora: ${brl(expectedCash)}.`)}
        </p>
      </div>

      <div className="space-y-2">
        <label htmlFor="movement-reason" className="text-sm font-semibold">
          Motivo{" "}
          <span className="font-normal text-muted-foreground">(opcional)</span>
        </label>
        <input
          id="movement-reason"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          maxLength={500}
          placeholder={copy.placeholder}
          className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none focus-visible:border-primary/50 focus-visible:ring-4 focus-visible:ring-primary/15"
        />
      </div>

      <button
        type="submit"
        disabled={amount <= 0 || tooMuch || move.isPending}
        className={`inline-flex h-11 w-full cursor-pointer items-center justify-center rounded-full text-sm font-semibold shadow-sm transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 ${
          type === "withdrawal"
            ? "bg-destructive text-white"
            : "bg-secondary text-secondary-foreground"
        }`}
      >
        {move.isPending ? "Registrando..." : copy.action}
      </button>
    </form>
  );
}
