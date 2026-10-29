"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Monitor } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { brl } from "@/components/DashCard";
import { CashRegister } from "@/interfaces/cash-register.interface";
import { useCashRegisterActions } from "@/hooks/useCashRegister";
import { getApiErrorMessage } from "@/utils/apiError";
import { MoneyInput } from "./MoneyInput";

interface TransferDialogProps {
  open: boolean;
  /** Outros caixas abertos que podem receber o troco */
  targets: CashRegister[];
  expectedCash: number;
  onOpenChange: (open: boolean) => void;
}

export function TransferDialog({
  open,
  targets,
  expectedCash,
  onOpenChange,
}: TransferDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        {/* Remonta o formulário a cada abertura para começar limpo */}
        {open && (
          <TransferForm
            targets={targets}
            expectedCash={expectedCash}
            onDone={() => onOpenChange(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

function TransferForm({
  targets,
  expectedCash,
  onDone,
}: {
  targets: CashRegister[];
  expectedCash: number;
  onDone: () => void;
}) {
  const { transfer } = useCashRegisterActions();
  const [toId, setToId] = useState(targets.length === 1 ? targets[0].id : "");
  const [amount, setAmount] = useState(0);
  const [reason, setReason] = useState("");
  const tooMuch = amount > expectedCash;
  const target = targets.find((t) => t.id === toId);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    transfer.mutate(
      { to_register_id: toId, amount, reason: reason.trim() || undefined },
      {
        onSuccess: () => {
          toast.success(
            `${brl(amount)} enviados. Aguardando o ${target?.name} aceitar.`,
          );
          onDone();
        },
        onError: (error) =>
          toast.error(getApiErrorMessage(error, "Erro ao transferir")),
      },
    );
  };

  return (
    <form onSubmit={submit} className="space-y-5">
      <DialogHeader>
        <DialogTitle>Transferir troco</DialogTitle>
        <DialogDescription>
          O dinheiro sai desta gaveta agora. O outro caixa precisa aceitar para
          ele entrar lá; se recusar, volta para cá.
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-2">
        <p className="text-sm font-semibold">Para qual caixa</p>
        <div role="radiogroup" className="grid gap-2">
          {targets.map((t) => {
            const active = t.id === toId;
            return (
              <button
                key={t.id}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => setToId(t.id)}
                className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 text-left transition-colors ${
                  active
                    ? "border-primary bg-primary/5 ring-1 ring-primary/30"
                    : "border-border hover:bg-muted/50"
                }`}
              >
                <Monitor
                  className={`h-4 w-4 ${active ? "text-primary" : "text-muted-foreground"}`}
                />
                <span className="min-w-0">
                  <span className="block font-medium text-foreground">
                    {t.name}
                  </span>
                  <span className="block truncate text-xs text-muted-foreground">
                    Aberto por {t.open_session?.opened_by_name}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="transfer-amount" className="text-sm font-semibold">
          Valor
        </label>
        <MoneyInput id="transfer-amount" value={amount} onChange={setAmount} />
        <p
          className={`text-xs ${tooMuch ? "font-semibold text-destructive" : "text-muted-foreground"}`}
        >
          {tooMuch
            ? `Maior que o dinheiro esperado na gaveta (${brl(expectedCash)}).`
            : `Esperado na gaveta agora: ${brl(expectedCash)}.`}
        </p>
      </div>

      <div className="space-y-2">
        <label htmlFor="transfer-reason" className="text-sm font-semibold">
          Observação{" "}
          <span className="font-normal text-muted-foreground">(opcional)</span>
        </label>
        <input
          id="transfer-reason"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          maxLength={500}
          placeholder="Ex.: moedas de R$ 1 e notas de R$ 5"
          className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none focus-visible:border-primary/50 focus-visible:ring-4 focus-visible:ring-primary/15"
        />
      </div>

      <button
        type="submit"
        disabled={!toId || amount <= 0 || tooMuch || transfer.isPending}
        className="inline-flex h-11 w-full cursor-pointer items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground shadow-sm transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {transfer.isPending
          ? "Enviando..."
          : target
            ? `Enviar ${brl(amount)} para ${target.name}`
            : "Escolha o caixa"}
      </button>
    </form>
  );
}
