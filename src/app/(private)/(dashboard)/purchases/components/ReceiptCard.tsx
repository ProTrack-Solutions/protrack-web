"use client";

import { useState } from "react";
import { toast } from "sonner";
import { FileText, Undo2 } from "lucide-react";
import { usePurchaseOrderUpdated } from "@/hooks/usePurchases";
import { PurchaseReceipt } from "@/interfaces/purchases.interface";
import { ReversePurchaseReceipt } from "@/service/purchases.service";
import { getApiErrorMessage } from "@/utils/apiError";
import { ReasonDialog } from "./ReasonDialog";
import { BILL_STATUS, formatDate, formatDateTime, money, unitMoney } from "./format";

export function ReceiptCard({
  receipt,
  index,
}: {
  receipt: PurchaseReceipt;
  index: number;
}) {
  const onUpdated = usePurchaseOrderUpdated();
  const [reversing, setReversing] = useState(false);

  const reversed = receipt.status === "reversed";
  const paidBills = receipt.bills.filter(
    (b) => b.status === "paid" || b.amount_paid > 0,
  );
  const invoice = [
    receipt.invoice_number && `NF ${receipt.invoice_number}`,
    receipt.invoice_series && `série ${receipt.invoice_series}`,
  ]
    .filter(Boolean)
    .join(" · ");

  const reverse = async (reason: string) => {
    try {
      const updated = await ReversePurchaseReceipt(receipt.id, reason);
      onUpdated(updated);
      toast.success("Recebimento estornado. Estoque, custo e contas foram revertidos.");
      setReversing(false);
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Não foi possível estornar o recebimento."));
    }
  };

  return (
    <article
      className={`rounded-2xl border p-4 ${
        reversed ? "border-dashed border-border bg-slate-50 dark:bg-muted/40" : "border-border bg-card"
      }`}
    >
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="flex flex-wrap items-center gap-2 font-semibold text-foreground">
            <FileText className="h-4 w-4 text-muted-foreground" />
            Recebimento {index + 1}
            {invoice && <span className="font-normal text-muted-foreground">· {invoice}</span>}
            {reversed && (
              <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-800 ring-1 ring-inset ring-red-200 dark:bg-red-500/15 dark:text-red-300 dark:ring-red-500/30">
                Estornado
              </span>
            )}
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {formatDateTime(receipt.received_at)} por {receipt.created_by_name || "—"}
          </p>
        </div>
        <div className="text-right">
          <p className={`text-lg font-bold tabular-nums ${reversed ? "text-muted-foreground line-through" : "text-foreground"}`}>
            {money(receipt.total)}
          </p>
          {!reversed && (
            <button
              type="button"
              onClick={() => setReversing(true)}
              disabled={paidBills.length > 0}
              title={paidBills.length > 0 ? "Há parcelas pagas: estorne o pagamento antes" : undefined}
              className="mt-1 inline-flex cursor-pointer items-center gap-1 text-xs font-medium text-destructive hover:underline disabled:cursor-not-allowed disabled:text-muted-foreground disabled:no-underline"
            >
              <Undo2 className="h-3.5 w-3.5" />
              Estornar
            </button>
          )}
        </div>
      </header>

      {reversed && (
        <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-900 dark:bg-red-500/10 dark:text-red-200">
          Estornado em {formatDateTime(receipt.reversed_at)} por{" "}
          {receipt.reversed_by_name || "—"}
          {receipt.reversal_reason && <>: “{receipt.reversal_reason}”</>}
        </p>
      )}

      <div className="mt-3 overflow-x-auto">
        <table className="w-full text-xs">
          <thead className="text-muted-foreground">
            <tr>
              <th className="py-1 text-left font-medium">Produto</th>
              <th className="py-1 text-right font-medium">Qtd.</th>
              <th className="py-1 text-right font-medium">Custo na nota</th>
              <th className="py-1 text-right font-medium">Custo final</th>
              <th className="py-1 text-right font-medium">Custo médio</th>
            </tr>
          </thead>
          <tbody>
            {receipt.items.map((it) => (
              <tr key={it.order_item_id} className="border-t border-border">
                <td className="py-1.5 pr-2">{it.product_name}</td>
                <td className="py-1.5 text-right tabular-nums">{it.quantity}</td>
                <td className="py-1.5 text-right tabular-nums">{unitMoney(it.unit_cost)}</td>
                <td className="py-1.5 text-right tabular-nums">{unitMoney(it.landed_unit_cost)}</td>
                <td className="py-1.5 text-right tabular-nums">
                  {money(it.previous_cost)} → {money(it.new_cost)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {(receipt.freight > 0 || receipt.other_expenses > 0 || receipt.discount > 0) && (
        <p className="mt-2 text-xs text-muted-foreground">
          Produtos {money(receipt.items_total)}
          {receipt.freight > 0 && ` + frete ${money(receipt.freight)}`}
          {receipt.other_expenses > 0 && ` + despesas ${money(receipt.other_expenses)}`}
          {receipt.discount > 0 && ` − desconto ${money(receipt.discount)}`}
        </p>
      )}

      {receipt.bills.length > 0 && (
        <ul className="mt-3 flex flex-wrap gap-2">
          {receipt.bills.map((bill, i) => (
            <li
              key={bill.id}
              className="rounded-lg border border-border px-2.5 py-1.5 text-xs"
            >
              <span className="text-muted-foreground">
                {receipt.bills.length > 1 ? `${i + 1}/${receipt.bills.length} · ` : ""}
                {formatDate(bill.due_date)}
              </span>{" "}
              <span className="font-semibold tabular-nums">{money(bill.amount)}</span>{" "}
              <span
                className={
                  bill.status === "paid"
                    ? "text-emerald-700 dark:text-emerald-400"
                    : bill.status === "canceled"
                      ? "text-muted-foreground line-through"
                      : bill.status === "overdue"
                        ? "text-red-700 dark:text-red-400"
                        : "text-muted-foreground"
                }
              >
                {BILL_STATUS[bill.status] ?? bill.status}
              </span>
            </li>
          ))}
        </ul>
      )}

      {receipt.notes && (
        <p className="mt-2 text-xs text-muted-foreground">Obs.: {receipt.notes}</p>
      )}

      <ReasonDialog
        open={reversing}
        onOpenChange={setReversing}
        title={`Estornar recebimento ${index + 1}?`}
        description={
          <>
            <p>
              O estoque dos itens volta, o custo médio é recalculado e as{" "}
              {receipt.bills.length} conta(s) a pagar deste recebimento serão canceladas.
            </p>
            <p>Só é possível se nenhuma parcela foi paga e o estoque atual cobrir a devolução.</p>
          </>
        }
        confirmLabel="Estornar recebimento"
        required
        destructive
        onConfirm={reverse}
      />
    </article>
  );
}
