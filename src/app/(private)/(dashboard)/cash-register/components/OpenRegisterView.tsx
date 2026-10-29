"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowDownCircle,
  ArrowLeftRight,
  ArrowUpCircle,
  Banknote,
  Coins,
  CreditCard,
  ListOrdered,
  Lock,
  Receipt,
  ShoppingCart,
  Users,
  Wallet,
} from "lucide-react";
import { DashCard, Kpi, brl } from "@/components/DashCard";
import {
  CashMovementType,
  CashSessionDetail,
} from "@/interfaces/cash-register.interface";
import { useDeviceCashRegister } from "@/hooks/useCashRegister";
import { MovementDialog } from "./MovementDialog";
import { TransferDialog } from "./TransferDialog";
import { PendingTransfers } from "./PendingTransfers";
import { CloseRegisterDialog } from "./CloseRegisterDialog";
import {
  CashComposition,
  MethodBreakdown,
  MovementsList,
  OperatorBreakdown,
} from "./SummaryParts";
import { formatDuration, formatTime, integer } from "./format";

interface OpenRegisterViewProps {
  registerName: string;
  detail: CashSessionDetail;
  onClosed: (id: string) => void;
}

const actionButton =
  "inline-flex h-9 cursor-pointer items-center gap-2 rounded-full border border-border bg-card px-4 text-sm font-semibold text-foreground shadow-sm transition-colors hover:bg-muted";

export function OpenRegisterView({
  registerName,
  detail,
  onClosed,
}: OpenRegisterViewProps) {
  const { session, summary, movements } = detail;
  const [movement, setMovement] = useState<CashMovementType | null>(null);
  const [closing, setClosing] = useState(false);
  const [transferring, setTransferring] = useState(false);
  const { registers, register } = useDeviceCashRegister();
  // Troco só vai para outro caixa que esteja aberto
  const targets = registers.filter(
    (r) => r.id !== register?.id && r.open_session,
  );
  const pendingTransfers =
    (detail.incoming_transfers?.length ?? 0) +
    (detail.outgoing_transfers?.length ?? 0);

  return (
    <div className="space-y-6">
      <div className="dash-in flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border/70 bg-card p-4 shadow-[var(--shadow-soft)]">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-foreground">
              {registerName}
            </h2>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary/15 px-2.5 py-0.5 text-xs font-semibold text-[hsl(150_45%_32%)]">
              <span className="h-2 w-2 animate-pulse rounded-full bg-secondary" />
              Aberto
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            Aberto por {session.user_name} às {formatTime(session.opened_at)} ·
            há {formatDuration(session.opened_at)}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setMovement("supply")}
            className={actionButton}
          >
            <ArrowUpCircle className="h-4 w-4 text-secondary" />
            Suprimento
          </button>
          <button
            type="button"
            onClick={() => setMovement("withdrawal")}
            className={actionButton}
          >
            <ArrowDownCircle className="h-4 w-4 text-destructive" />
            Sangria
          </button>
          {targets.length > 0 && (
            <button
              type="button"
              onClick={() => setTransferring(true)}
              className={actionButton}
            >
              <ArrowLeftRight className="h-4 w-4 text-primary" />
              Transferir troco
            </button>
          )}
          <Link href="/sale" className={actionButton}>
            <ShoppingCart className="h-4 w-4 text-primary" />
            Nova venda
          </Link>
          <button
            type="button"
            onClick={() => setClosing(true)}
            disabled={pendingTransfers > 0}
            title={
              pendingTransfers > 0
                ? "Resolva as transferências de troco pendentes antes de fechar"
                : undefined
            }
            className="inline-flex h-9 cursor-pointer items-center gap-2 rounded-full bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-sm transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Lock className="h-4 w-4" />
            Fechar caixa
          </button>
        </div>
      </div>

      <PendingTransfers detail={detail} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Kpi
          tone="primary"
          label="Esperado na gaveta"
          icon={<Wallet className="h-4 w-4" />}
          loading={false}
          value={summary.expected_cash}
          footer={`Abertura de ${brl(session.opening_amount)}`}
          delay={0}
        />
        <Kpi
          tone="plain"
          label="Total recebido"
          icon={<Coins className="h-4 w-4 text-secondary" />}
          loading={false}
          value={summary.received_total}
          footer="Todas as formas de pagamento"
          delay={60}
        />
        <Kpi
          tone="plain"
          label="Vendas no turno"
          icon={<Receipt className="h-4 w-4 text-primary" />}
          loading={false}
          value={summary.sales_count}
          format={integer}
          footer={`${brl(summary.sales_total)} vendidos`}
          delay={120}
        />
        <Kpi
          tone="plain"
          label="Dinheiro recebido"
          icon={<Banknote className="h-4 w-4 text-secondary" />}
          loading={false}
          value={summary.cash_received}
          footer={
            summary.receipts_count > 0
              ? `Inclui ${summary.receipts_count} ${summary.receipts_count === 1 ? "parcela" : "parcelas"} de crediário`
              : "Vendas e entradas em espécie"
          }
          delay={180}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <DashCard
          title="Recebido por forma de pagamento"
          icon={<CreditCard className="h-4 w-4" />}
          className="lg:col-span-2"
          delay={240}
        >
          <MethodBreakdown summary={summary} />
        </DashCard>

        <DashCard
          title="Dinheiro na gaveta"
          icon={<Banknote className="h-4 w-4" />}
          delay={300}
        >
          <CashComposition
            openingAmount={session.opening_amount}
            summary={summary}
          />
        </DashCard>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <DashCard
          title="Vendas por operador"
          icon={<Users className="h-4 w-4" />}
          delay={360}
        >
          <OperatorBreakdown summary={summary} />
        </DashCard>

        <DashCard
          title="Sangrias, suprimentos e transferências"
          icon={<ListOrdered className="h-4 w-4" />}
          className="lg:col-span-2"
          delay={420}
        >
          <MovementsList movements={movements} />
        </DashCard>
      </div>

      <TransferDialog
        open={transferring}
        targets={targets}
        expectedCash={summary.expected_cash}
        onOpenChange={setTransferring}
      />
      <MovementDialog
        type={movement}
        expectedCash={summary.expected_cash}
        onOpenChange={(open) => !open && setMovement(null)}
      />
      <CloseRegisterDialog
        open={closing}
        detail={detail}
        onOpenChange={setClosing}
        onClosed={(id) => {
          setClosing(false);
          onClosed(id);
        }}
      />
    </div>
  );
}
