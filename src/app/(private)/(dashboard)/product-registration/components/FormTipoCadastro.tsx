"use client";

import { Check, Grid3x3, Package } from "lucide-react";
import { cn } from "@/lib/utils";

interface FormTipoCadastroProps {
  gridEnabled: boolean;
  onChange: (gridEnabled: boolean) => void;
}

const SAMPLE = ["Preta – P", "Preta – M", "Branca – P", "Branca – M"];

/**
 * Primeiro passo do cadastro: produto simples ou modelo com grade. Fica no
 * topo para a pessoa decidir antes de preencher o resto.
 */
export function FormTipoCadastro({ gridEnabled, onChange }: FormTipoCadastroProps) {
  const option = (selected: boolean) =>
    cn(
      "relative flex h-full cursor-pointer flex-col gap-3 rounded-xl border-2 p-4 text-left transition-colors",
      selected
        ? "border-blue-500 bg-blue-50/60 dark:bg-blue-500/10"
        : "border-border hover:border-blue-300 hover:bg-muted/40",
    );

  const check = (selected: boolean) =>
    selected && (
      <span className="absolute right-3 top-3 grid h-5 w-5 place-items-center rounded-full bg-blue-600 text-white">
        <Check className="h-3 w-3" />
      </span>
    );

  return (
    <section
      role="radiogroup"
      aria-label="Tipo de cadastro"
      className="grid gap-3 rounded-2xl border border-border/50 bg-card p-4 sm:grid-cols-2"
    >
      <p className="text-sm font-semibold text-foreground sm:col-span-2">
        O que você vai cadastrar?
      </p>

      <button
        type="button"
        role="radio"
        aria-checked={!gridEnabled}
        onClick={() => onChange(false)}
        className={option(!gridEnabled)}
      >
        {check(!gridEnabled)}
        <span className="flex items-center gap-2 font-semibold">
          <Package className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
          Produto simples
        </span>
        <span className="text-xs text-muted-foreground">
          Um item, com um código de barras e um estoque. Ex.: cimento 50kg,
          furadeira, um tênis num tamanho só.
        </span>
      </button>

      <button
        type="button"
        role="radio"
        aria-checked={gridEnabled}
        onClick={() => onChange(true)}
        className={option(gridEnabled)}
      >
        {check(gridEnabled)}
        <span className="flex items-center gap-2 font-semibold">
          <Grid3x3 className="h-4 w-4 text-fuchsia-600 dark:text-fuchsia-400" />
          Produto com grade (cores e tamanhos)
        </span>
        <span className="text-xs text-muted-foreground">
          O mesmo modelo em várias cores e/ou tamanhos. Cada combinação vira um
          item com código de barras e estoque próprios, agrupados pelo modelo.
        </span>
        <span className="flex flex-wrap items-center gap-1 text-[11px]">
          <span className="font-medium text-foreground">Camiseta Básica →</span>
          {SAMPLE.map((s) => (
            <span
              key={s}
              className="rounded-md border border-fuchsia-200 bg-fuchsia-50 px-1.5 py-0.5 text-fuchsia-800 dark:border-fuchsia-500/30 dark:bg-fuchsia-500/10 dark:text-fuchsia-200"
            >
              {s}
            </span>
          ))}
        </span>
      </button>
    </section>
  );
}
