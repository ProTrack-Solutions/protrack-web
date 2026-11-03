"use client";

import { useState } from "react";
import { LockOpen } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCashRegisterActions } from "@/hooks/useCashRegister";
import { getApiErrorMessage } from "@/utils/apiError";
import { MoneyInput } from "../../cash-register/components/MoneyInput";

interface OpenRegisterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/** Abre o caixa sem sair da tela de venda */
export function OpenRegisterDialog({
  open,
  onOpenChange,
}: OpenRegisterDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        {/* Remonta o formulário a cada abertura para começar limpo */}
        {open && <OpenRegisterForm onDone={() => onOpenChange(false)} />}
      </DialogContent>
    </Dialog>
  );
}

function OpenRegisterForm({ onDone }: { onDone: () => void }) {
  const { open } = useCashRegisterActions();
  const [amount, setAmount] = useState(0);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    open.mutate(
      { opening_amount: amount },
      {
        onSuccess: () => {
          toast.success("Caixa aberto. Boas vendas!");
          onDone();
        },
        onError: (error) =>
          toast.error(getApiErrorMessage(error, "Erro ao abrir o caixa")),
      },
    );
  };

  return (
    <form onSubmit={submit} className="space-y-5">
      <DialogHeader>
        <DialogTitle>Abrir caixa</DialogTitle>
        <DialogDescription>
          As vendas e recebimentos neste caixa, de qualquer operador, entram no turno.
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-2">
        <label htmlFor="quick-opening-amount" className="text-sm font-semibold">
          Valor inicial na gaveta
        </label>
        <MoneyInput
          id="quick-opening-amount"
          value={amount}
          onChange={setAmount}
          autoFocus
        />
        <p className="text-xs text-muted-foreground">
          O dinheiro de troco que já está no caixa. Pode ser R$ 0,00.
        </p>
      </div>

      <button
        type="submit"
        disabled={open.isPending}
        className="inline-flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-primary text-sm font-semibold text-primary-foreground shadow-sm transition-opacity hover:opacity-90 disabled:cursor-wait disabled:opacity-60"
      >
        <LockOpen className="h-4 w-4" />
        {open.isPending ? "Abrindo..." : "Abrir caixa"}
      </button>
    </form>
  );
}
