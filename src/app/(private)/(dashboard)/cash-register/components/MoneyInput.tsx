"use client";

import { formatCurrency } from "@/utils/currencyFormat";

interface MoneyInputProps {
  id: string;
  value: number;
  onChange: (value: number) => void;
  autoFocus?: boolean;
}

/** Campo em reais que digita como maquininha: cada dígito entra pelos centavos */
export function MoneyInput({
  id,
  value,
  onChange,
  autoFocus,
}: MoneyInputProps) {
  return (
    <div className="relative">
      <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-muted-foreground">
        R$
      </span>
      <input
        id={id}
        inputMode="numeric"
        autoComplete="off"
        autoFocus={autoFocus}
        value={formatCurrency(value)}
        onChange={(e) => {
          const digits = e.target.value.replace(/\D/g, "").slice(0, 11);
          onChange(Number(digits || "0") / 100);
        }}
        className="h-12 w-full rounded-xl border border-border bg-background pl-11 pr-4 text-right text-xl font-bold tabular-nums text-foreground outline-none transition-shadow focus-visible:border-primary/50 focus-visible:ring-4 focus-visible:ring-primary/15"
      />
    </div>
  );
}
