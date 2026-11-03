"use client";

import { Monitor } from "lucide-react";
import { CashRegister } from "@/interfaces/cash-register.interface";
import { useDeviceCashRegister } from "@/hooks/useCashRegister";
import { formatTime } from "./format";

function RegisterStatus({ register }: { register: CashRegister }) {
  const open = register.open_session;
  return open ? (
    <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-secondary" />
      <span className="truncate">
        Aberto por {open.opened_by_name} às {formatTime(open.opened_at)}
      </span>
    </span>
  ) : (
    <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground/40" />
      Fechado
    </span>
  );
}

/** Lista para o computador escolher em qual caixa físico trabalha */
export function RegisterPicker({ onChosen }: { onChosen?: () => void }) {
  const { registers, choose } = useDeviceCashRegister();

  return (
    <ul className="grid gap-3 sm:grid-cols-2">
      {registers.map((r) => (
        <li key={r.id}>
          <button
            type="button"
            onClick={() => {
              choose(r.id);
              onChosen?.();
            }}
            className="flex w-full cursor-pointer items-center gap-3 rounded-xl border border-border bg-card p-4 text-left shadow-sm transition-colors hover:border-primary/40 hover:bg-primary/5"
          >
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
              <Monitor className="h-5 w-5" />
            </span>
            <span className="min-w-0">
              <span className="block truncate font-semibold text-foreground">
                {r.name}
              </span>
              <RegisterStatus register={r} />
            </span>
          </button>
        </li>
      ))}
    </ul>
  );
}

/**
 * Situação de todos os caixas da loja, com o deste computador em destaque.
 * Só aparece com mais de um caixa ativo; enquanto o computador não escolheu,
 * vira a pergunta "em qual caixa você está?".
 */
export function RegistersBar() {
  const { registers, register, needsChoice, choose } = useDeviceCashRegister();
  if (registers.length < 2) return null;

  return (
    <section
      className={`dash-in space-y-3 ${
        needsChoice
          ? "rounded-2xl border border-primary/30 bg-primary/5 p-5"
          : ""
      }`}
    >
      <div>
        <h2 className="text-sm font-semibold text-foreground">
          {needsChoice
            ? "Em qual caixa este computador trabalha?"
            : "Caixas da loja"}
        </h2>
        <p className="text-xs text-muted-foreground">
          {needsChoice
            ? "As vendas feitas aqui entram no turno do caixa escolhido. A escolha fica salva neste navegador."
            : "Vários funcionários podem vender no mesmo caixa aberto. Cada computador trabalha em um caixa."}
        </p>
      </div>

      <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {registers.map((r) => {
          const mine = r.id === register?.id;
          return (
            <li
              key={r.id}
              className={`flex flex-col gap-3 rounded-xl border p-4 transition-colors ${
                mine
                  ? "border-primary bg-card shadow-[var(--shadow-soft)] ring-1 ring-primary/30"
                  : "border-border bg-card"
              }`}
            >
              <div className="flex items-start gap-3">
                <span
                  className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg ${
                    mine
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  <Monitor className="h-4 w-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-foreground">
                    {r.name}
                  </p>
                  <RegisterStatus register={r} />
                </div>
              </div>
              {mine ? (
                <span className="self-start rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                  Este computador
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => choose(r.id)}
                  className="self-start cursor-pointer rounded-full border border-border px-3 py-1 text-xs font-semibold text-muted-foreground transition-colors hover:border-primary/40 hover:bg-primary/5 hover:text-foreground"
                >
                  Usar neste computador
                </button>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
