"use client";

import { useState } from "react";
import { History, LockOpen, Users, Vault } from "lucide-react";
import { toast } from "sonner";
import { brl } from "@/components/DashCard";
import { CashRegister } from "@/interfaces/cash-register.interface";
import { useCashRegisterActions } from "@/hooks/useCashRegister";
import { getApiErrorMessage } from "@/utils/apiError";
import { MoneyInput } from "./MoneyInput";
import { formatDateTime } from "./format";

/** Abertura do turno do caixa deste computador */
export function OpenRegisterCard({ register }: { register: CashRegister }) {
  const { open } = useCashRegisterActions();
  const last = register.last_closing;
  const [amount, setAmount] = useState(0);
  const [notes, setNotes] = useState("");

  const lastCounted = last?.counted_cash ?? 0;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    open.mutate(
      { opening_amount: amount, notes: notes.trim() || undefined },
      {
        onSuccess: () => toast.success(`${register.name} aberto. Boas vendas!`),
        onError: (error) =>
          toast.error(getApiErrorMessage(error, "Erro ao abrir o caixa")),
      },
    );
  };

  return (
    <section className="dash-in mx-auto grid max-w-4xl overflow-hidden rounded-2xl border border-border/70 bg-card shadow-[var(--shadow-soft)] md:grid-cols-[1fr_1.1fr]">
      <div className="flex flex-col gap-6 bg-[image:var(--gradient-primary)] p-8 text-primary-foreground">
        <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white/20">
          <Vault className="h-6 w-6" />
        </span>
        <div>
          <h2 className="text-2xl font-bold">{register.name} está fechado</h2>
          <p className="mt-2 text-sm text-primary-foreground/85">
            Abra o turno para começar a vender neste caixa. No fim do dia é só
            contar a gaveta e fechar.
          </p>
        </div>

        <ul className="mt-auto space-y-3 text-sm text-primary-foreground/90">
          <li className="flex gap-3">
            <Users className="mt-0.5 h-4 w-4 shrink-0" />
            O turno é do caixa, não de quem abre: qualquer funcionário vende,
            faz sangria e pode fechar.
          </li>
          <li className="flex gap-3">
            <History className="mt-0.5 h-4 w-4 shrink-0" />
            O fechamento mostra quanto cada pessoa vendeu no turno.
          </li>
        </ul>
      </div>

      <form onSubmit={submit} className="space-y-5 p-8">
        {last && (
          <div className="rounded-xl border border-border/70 bg-muted/30 p-4 text-sm">
            <p className="font-semibold text-foreground">Último fechamento</p>
            <p className="mt-1 text-muted-foreground">
              {formatDateTime(last.closed_at)}
              {last.closed_by_name && ` por ${last.closed_by_name}`} · contado{" "}
              <span className="font-semibold text-foreground tabular-nums">
                {brl(lastCounted)}
              </span>
            </p>
            {lastCounted > 0 && amount !== lastCounted && (
              <button
                type="button"
                onClick={() => setAmount(lastCounted)}
                className="mt-2 cursor-pointer text-xs font-semibold text-primary hover:underline"
              >
                O dinheiro ficou na gaveta? Usar {brl(lastCounted)} como troco
              </button>
            )}
          </div>
        )}

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
          {open.isPending ? "Abrindo..." : `Abrir ${register.name}`}
        </button>
      </form>
    </section>
  );
}
