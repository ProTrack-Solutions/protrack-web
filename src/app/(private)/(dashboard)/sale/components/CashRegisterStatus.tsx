"use client";

import { useState } from "react";
import Link from "next/link";
import { LockOpen, Wallet } from "lucide-react";
import {
  useCurrentCashSession,
  useRequireOpenCashRegister,
} from "@/hooks/useCashRegister";
import { OpenRegisterDialog } from "./OpenRegisterDialog";
import { formatTime } from "../../cash-register/components/format";

/** Avisa na tela de venda se o caixa do operador está aberto ou fechado */
export function CashRegisterStatus() {
  const { data: current, isLoading, isError } = useCurrentCashSession();
  const required = useRequireOpenCashRegister();
  const [openDialog, setOpenDialog] = useState(false);

  if (isLoading || isError) return null;

  if (current) {
    return (
      <Link
        href="/cash-register"
        className="dash-in inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-semibold text-muted-foreground shadow-sm transition-colors hover:text-foreground"
      >
        <span className="h-2 w-2 rounded-full bg-secondary" />
        Caixa aberto desde {formatTime(current.session.opened_at)}
      </Link>
    );
  }

  return (
    <div
      className={`dash-in flex flex-col gap-3 rounded-2xl border p-4 sm:flex-row sm:items-center sm:justify-between ${
        required
          ? "border-destructive/30 bg-destructive/10"
          : "border-amber-500/30 bg-amber-500/10"
      }`}
    >
      <div className="flex items-start gap-3">
        <Wallet
          className={`mt-0.5 h-5 w-5 shrink-0 ${
            required
              ? "text-destructive"
              : "text-amber-600 dark:text-amber-400"
          }`}
        />
        <div>
          <p className="font-semibold text-foreground">
            Seu caixa está fechado
          </p>
          <p className="text-sm text-muted-foreground">
            {required
              ? "Abra o caixa para registrar vendas."
              : "As vendas feitas agora não entram em nenhum fechamento de caixa."}
          </p>
        </div>
      </div>
      <button
        type="button"
        onClick={() => setOpenDialog(true)}
        className="inline-flex h-9 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-full bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-sm transition-opacity hover:opacity-90"
      >
        <LockOpen className="h-4 w-4" />
        Abrir caixa
      </button>
      <OpenRegisterDialog open={openDialog} onOpenChange={setOpenDialog} />
    </div>
  );
}
