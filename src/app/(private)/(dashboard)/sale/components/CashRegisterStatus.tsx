"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeftRight, LockOpen, Monitor, Wallet } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  useCurrentCashSession,
  useRequireOpenCashRegister,
} from "@/hooks/useCashRegister";
import { OpenRegisterDialog } from "./OpenRegisterDialog";
import { formatTime } from "../../cash-register/components/format";
import { RegisterPicker } from "../../cash-register/components/RegisterPicker";

/** Avisa na tela de venda se o caixa deste computador está aberto ou fechado */
export function CashRegisterStatus() {
  const {
    data: current,
    isLoading,
    isError,
    register,
    needsChoice,
  } = useCurrentCashSession();
  const required = useRequireOpenCashRegister();
  const [openDialog, setOpenDialog] = useState(false);
  const [choosing, setChoosing] = useState(false);

  // Vários caixas e o computador ainda não escolheu: sem isso a venda não sabe a gaveta
  if (needsChoice) {
    return (
      <div className="dash-in flex flex-col gap-3 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <Monitor className="mt-0.5 h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" />
          <div>
            <p className="font-semibold text-foreground">
              Em qual caixa este computador trabalha?
            </p>
            <p className="text-sm text-muted-foreground">
              Escolha o caixa para as vendas entrarem no turno certo.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setChoosing(true)}
          className="inline-flex h-9 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-full bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-sm transition-opacity hover:opacity-90"
        >
          Escolher caixa
        </button>
        <Dialog open={choosing} onOpenChange={setChoosing}>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>Em qual caixa este computador trabalha?</DialogTitle>
              <DialogDescription>
                Fica salvo neste navegador. Dá para trocar na tela de Caixa.
              </DialogDescription>
            </DialogHeader>
            <RegisterPicker onChosen={() => setChoosing(false)} />
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  if (isLoading || isError || !register) return null;

  if (current) {
    const incoming = current.incoming_transfers?.length ?? 0;
    return (
      <div className="flex flex-wrap items-center gap-2">
        <Link
          href="/cash-register"
          className="dash-in inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-semibold text-muted-foreground shadow-sm transition-colors hover:text-foreground"
        >
          <span className="h-2 w-2 rounded-full bg-secondary" />
          {register.name} aberto desde {formatTime(current.session.opened_at)}
        </Link>
        {/* Troco enviado por outro caixa espera alguém daqui aceitar */}
        {incoming > 0 && (
          <Link
            href="/cash-register"
            className="dash-in inline-flex items-center gap-2 rounded-full border border-amber-500/40 bg-amber-500/10 px-3 py-1.5 text-xs font-semibold text-amber-800 shadow-sm transition-colors hover:bg-amber-500/20 dark:text-amber-300"
          >
            <ArrowLeftRight className="h-3.5 w-3.5" />
            {incoming === 1
              ? "1 transferência de troco para aceitar"
              : `${incoming} transferências de troco para aceitar`}
          </Link>
        )}
      </div>
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
            required ? "text-destructive" : "text-amber-600 dark:text-amber-400"
          }`}
        />
        <div>
          <p className="font-semibold text-foreground">
            {register.name} está fechado
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
