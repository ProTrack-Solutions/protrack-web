"use client";

import { useState } from "react";
import { LockOpen, Vault } from "lucide-react";
import { toast } from "sonner";
import { useCashRegisterActions } from "@/hooks/useCashRegister";
import { getApiErrorMessage } from "@/utils/apiError";
import { MoneyInput } from "./MoneyInput";

export function OpenRegisterCard() {
  const { open } = useCashRegisterActions();
  const [amount, setAmount] = useState(0);
  const [notes, setNotes] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    open.mutate(
      { opening_amount: amount, notes: notes.trim() || undefined },
      {
        onSuccess: () => toast.success("Caixa aberto. Boas vendas!"),
        onError: (error) =>
          toast.error(getApiErrorMessage(error, "Erro ao abrir o caixa")),
      },
    );
  };

  return (
    <section className="dash-in mx-auto grid max-w-4xl overflow-hidden rounded-2xl border border-border/70 bg-card shadow-[var(--shadow-soft)] md:grid-cols-[1fr_1.1fr]">
      <div className="flex flex-col justify-between gap-6 bg-[image:var(--gradient-primary)] p-8 text-primary-foreground">
        <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white/20">
          <Vault className="h-6 w-6" />
        </span>
        <div>
          <h2 className="text-2xl font-bold">Seu caixa está fechado</h2>
          <p className="mt-2 text-sm text-primary-foreground/85">
            Abra o caixa para começar o turno. As vendas e recebimentos que você
            fizer a partir de agora entram no resumo, e no fim do dia é só
            contar a gaveta e fechar.
          </p>
        </div>
      </div>

      <form onSubmit={submit} className="space-y-5 p-8">
        <div className="space-y-2">
          <label
            htmlFor="opening-amount"
            className="text-sm font-semibold text-foreground"
          >
            Valor inicial na gaveta
          </label>
          <MoneyInput
            id="opening-amount"
            value={amount}
            onChange={setAmount}
            autoFocus
          />
          <p className="text-xs text-muted-foreground">
            O dinheiro de troco que já está no caixa. Pode ser R$ 0,00.
          </p>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="opening-notes"
            className="text-sm font-semibold text-foreground"
          >
            Observação{" "}
            <span className="font-normal text-muted-foreground">
              (opcional)
            </span>
          </label>
          <textarea
            id="opening-notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            maxLength={500}
            rows={2}
            placeholder="Ex.: troco conferido com a gerente"
            className="w-full resize-none rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus-visible:border-primary/50 focus-visible:ring-4 focus-visible:ring-primary/15"
          />
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
    </section>
  );
}
