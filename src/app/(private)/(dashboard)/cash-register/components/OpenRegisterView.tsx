"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowDownCircle,
  ArrowUpCircle,
  Banknote,
  Coins,
  CreditCard,
  ListOrdered,
  Lock,
  Receipt,
  ShoppingCart,
  Wallet,
} from "lucide-react";
import { DashCard, Kpi, brl } from "@/components/DashCard";
import {
  CashMovementType,
  CashSessionDetail,
} from "@/interfaces/cash-register.interface";
import { MovementDialog } from "./MovementDialog";
import { CloseRegisterDialog } from "./CloseRegisterDialog";
import {
  CashComposition,
  MethodBreakdown,
  MovementsList,
} from "./SummaryParts";
import { integer } from "./format";

interface OpenRegisterViewProps {
  detail: CashSessionDetail;
  onClosed: (id: string) => void;
}

const actionButton =
  "inline-flex h-9 cursor-pointer items-center gap-2 rounded-full border border-border bg-card px-4 text-sm font-semibold text-foreground shadow-sm transition-colors hover:bg-muted";

export function OpenRegisterView({ detail, onClosed }: OpenRegisterViewProps) {
  const { session, summary, movements } = detail;
  const [movement, setMovement] = useState<CashMovementType | null>(null);
  const [closing, setClosing] = useState(false);

  return (
    <div className="space-y-6">
      <div className="dash-in flex flex-wrap items-center justify-end gap-2">
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
        <Link href="/sale" className={actionButton}>
          <ShoppingCart className="h-4 w-4 text-primary" />
          Nova venda
        </Link>
        <button
          type="button"
          onClick={() => setClosing(true)}
          className="inline-flex h-9 cursor-pointer items-center gap-2 rounded-full bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-sm transition-opacity hover:opacity-90"
        >
          <Lock className="h-4 w-4" />
          Fechar caixa
        </button>
      </div>

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

      <DashCard
        title="Sangrias e suprimentos"
        icon={<ListOrdered className="h-4 w-4" />}
        delay={360}
      >
        <MovementsList movements={movements} />
      </DashCard>

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
