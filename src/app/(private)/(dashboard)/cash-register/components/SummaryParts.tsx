import { ArrowDownCircle, ArrowUpCircle, Inbox } from "lucide-react";
import { brl } from "@/components/DashCard";
import {
  CashMovement,
  CashSummary,
} from "@/interfaces/cash-register.interface";
import {
  getPaymentMethodColor,
  getPaymentMethodLabel,
} from "@/utils/paymentMethodFormat";
import { POSITIVE_TEXT, formatTime } from "./format";

/** Quanto entrou em cada forma de pagamento, com barra proporcional */
export function MethodBreakdown({ summary }: { summary: CashSummary }) {
  const methods = summary.by_method.filter(
    (m) => m.received > 0 || m.sales_count > 0,
  );
  const max = Math.max(...methods.map((m) => m.received), 1);

  if (methods.length === 0) {
    return (
      <EmptyState text="Nenhuma venda ou recebimento neste caixa ainda." />
    );
  }

  return (
    <ul className="space-y-4">
      {methods.map((m) => {
        const color = getPaymentMethodColor(m.payment_method);
        const details = [
          m.sales_count &&
            `${m.sales_count} ${m.sales_count === 1 ? "venda" : "vendas"}`,
          m.receipts_count &&
            `${m.receipts_count} ${m.receipts_count === 1 ? "parcela recebida" : "parcelas recebidas"}`,
        ].filter(Boolean);
        return (
          <li key={m.payment_method}>
            <div className="flex items-baseline justify-between gap-3 text-sm">
              <span className="flex items-center gap-2 font-medium text-foreground">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: color }}
                />
                {getPaymentMethodLabel(m.payment_method)}
              </span>
              <span className="font-semibold tabular-nums text-foreground">
                {brl(m.received)}
              </span>
            </div>
            <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full transition-[width] duration-700"
                style={{
                  width: `${(m.received / max) * 100}%`,
                  backgroundColor: color,
                }}
              />
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              {details.join(" · ")}
              {m.payment_method === "installments" &&
                ` · ${brl(m.sales_total)} vendidos, só a entrada entra no caixa`}
            </p>
          </li>
        );
      })}
    </ul>
  );
}

/** Conta do dinheiro que deveria estar na gaveta */
export function CashComposition({
  openingAmount,
  summary,
}: {
  openingAmount: number;
  summary: CashSummary;
}) {
  const rows = [
    { label: "Abertura (troco)", value: openingAmount, sign: "" },
    {
      label: "Recebido em dinheiro",
      value: summary.cash_received,
      sign: "+",
    },
    { label: "Suprimentos", value: summary.supplies_total, sign: "+" },
    { label: "Sangrias", value: summary.withdrawals_total, sign: "−" },
  ];

  return (
    <dl className="space-y-2.5 text-sm">
      {rows.map((r) => (
        <div key={r.label} className="flex items-center justify-between gap-3">
          <dt className="text-muted-foreground">{r.label}</dt>
          <dd
            className={`font-medium tabular-nums ${
              r.sign === "−" && r.value > 0
                ? "text-destructive"
                : "text-foreground"
            }`}
          >
            {r.sign && r.value > 0 ? `${r.sign} ` : ""}
            {brl(r.value)}
          </dd>
        </div>
      ))}
      {summary.change_count > 0 && (
        <p className="text-xs text-muted-foreground">
          Recebido já descontado de {brl(summary.change_total)} de troco em{" "}
          {summary.change_count}{" "}
          {summary.change_count === 1 ? "venda" : "vendas"}
        </p>
      )}
      <div className="flex items-center justify-between gap-3 border-t border-border pt-2.5">
        <dt className="font-semibold text-foreground">Esperado na gaveta</dt>
        <dd className="text-base font-bold tabular-nums text-foreground">
          {brl(summary.expected_cash)}
        </dd>
      </div>
    </dl>
  );
}

export function MovementsList({ movements }: { movements: CashMovement[] }) {
  if (movements.length === 0) {
    return <EmptyState text="Nenhuma sangria ou suprimento registrado." />;
  }

  return (
    <ul className="divide-y divide-border/60">
      {movements.map((m) => {
        const supply = m.type === "supply";
        const Icon = supply ? ArrowUpCircle : ArrowDownCircle;
        return (
          <li key={m.id} className="flex items-center gap-3 py-2.5">
            <Icon
              className={`h-5 w-5 shrink-0 ${supply ? POSITIVE_TEXT : "text-destructive"}`}
            />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-foreground">
                {supply ? "Suprimento" : "Sangria"}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {formatTime(m.created_at)}
                {m.reason ? ` · ${m.reason}` : ""}
              </p>
            </div>
            <span
              className={`text-sm font-semibold tabular-nums ${supply ? POSITIVE_TEXT : "text-destructive"}`}
            >
              {supply ? "+" : "−"} {brl(m.amount)}
            </span>
          </li>
        );
      })}
    </ul>
  );
}

export function EmptyState({ text }: { text: string }) {
  return (
    <div className="flex flex-col items-center gap-2 py-6 text-center text-sm text-muted-foreground">
      <Inbox className="h-6 w-6" />
      {text}
    </div>
  );
}
