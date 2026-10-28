"use client";

import { use, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
  AlertCircle,
  ArrowLeft,
  Ban,
  CalendarClock,
  Loader2,
  Lock,
  Mail,
  PackageCheck,
  Pencil,
  Send,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/DashCard";
import { usePurchaseOrder, usePurchaseOrderUpdated } from "@/hooks/usePurchases";
import {
  CancelPurchaseOrder,
  ClosePurchaseOrder,
} from "@/service/purchases.service";
import { getApiErrorMessage } from "@/utils/apiError";
import { OrderStatusBadge } from "../components/OrderStatusBadge";
import { ReasonDialog } from "../components/ReasonDialog";
import { ReceiptCard } from "../components/ReceiptCard";
import { ReceiveDialog } from "../components/ReceiveDialog";
import {
  SendOrderDialog,
  emailOrderWithFeedback,
} from "../components/SendOrderDialog";
import { formatDate, formatDateTime, money, unitMoney } from "../components/format";

export default function PurchaseOrderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: order, isLoading, isError, error, refetch } = usePurchaseOrder(id);
  const onUpdated = usePurchaseOrderUpdated();

  const [receiving, setReceiving] = useState(false);
  const [closing, setClosing] = useState(false);
  const [canceling, setCanceling] = useState(false);
  const [sending, setSending] = useState(false);
  const [emailing, setEmailing] = useState(false);

  if (isLoading) {
    return (
      <div className="space-y-6 p-6">
        <Skeleton className="h-10 w-72" />
        <Skeleton className="h-28 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className="p-6">
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-destructive/30 bg-destructive/5 p-10 text-center">
          <AlertCircle className="h-8 w-8 text-destructive" />
          <p className="font-medium text-foreground">
            {getApiErrorMessage(error, "Não foi possível carregar o pedido.")}
          </p>
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link href="/purchases">Voltar para compras</Link>
            </Button>
            <Button onClick={() => refetch()} className="cursor-pointer">
              Tentar novamente
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const progress = order.quantity > 0 ? (order.received_quantity / order.quantity) * 100 : 0;
  const pending = order.items.reduce((s, it) => s + it.pending_quantity, 0);
  const pendingValue = order.items.reduce((s, it) => s + it.pending_quantity * it.unit_cost, 0);

  const resendEmail = async () => {
    setEmailing(true);
    const updated = await emailOrderWithFeedback(order.id, "resend", order.vendor_email);
    if (updated) onUpdated(updated);
    setEmailing(false);
  };

  const finish = (action: "close" | "cancel") => async (reason: string) => {
    try {
      const updated =
        action === "close"
          ? await ClosePurchaseOrder(order.id, reason)
          : await CancelPurchaseOrder(order.id, reason);
      onUpdated(updated);
      toast.success(action === "close" ? "Pedido encerrado." : "Pedido cancelado.");
      setClosing(false);
      setCanceling(false);
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Não foi possível concluir a ação."));
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="dash-in flex flex-wrap items-start justify-between gap-4">
        <div>
          <Link
            href="/purchases"
            className="mb-2 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Compras
          </Link>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Pedido nº {order.number}
            </h1>
            <OrderStatusBadge status={order.status} />
          </div>
          <p className="mt-1 text-muted-foreground">
            {order.vendor_name} · criado em {formatDateTime(order.created_at)} por{" "}
            {order.created_by_name || "—"}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {order.can_cancel && (
            <Button variant="outline" onClick={() => setCanceling(true)} className="cursor-pointer text-destructive hover:text-destructive">
              <Ban className="h-4 w-4" />
              Cancelar
            </Button>
          )}
          {order.can_close && (
            <Button variant="outline" onClick={() => setClosing(true)} className="cursor-pointer">
              <Lock className="h-4 w-4" />
              Encerrar pedido
            </Button>
          )}
          {order.can_edit && (
            <Button variant="outline" asChild>
              <Link href={`/purchases/${order.id}/edit`}>
                <Pencil className="h-4 w-4" />
                Editar
              </Link>
            </Button>
          )}
          {order.can_email && order.vendor_email && (
            <Button variant="outline" onClick={resendEmail} disabled={emailing} className="cursor-pointer">
              {emailing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mail className="h-4 w-4" />}
              Reenviar e-mail
            </Button>
          )}
          {order.can_send && (
            <Button variant="outline" onClick={() => setSending(true)} className="cursor-pointer">
              <Send className="h-4 w-4" />
              Enviar ao fornecedor
            </Button>
          )}
          {order.can_receive && (
            <Button onClick={() => setReceiving(true)} className="cursor-pointer">
              <PackageCheck className="h-4 w-4" />
              Receber mercadoria
            </Button>
          )}
        </div>
      </div>

      <section className="dash-in grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl bg-[image:var(--gradient-primary)] p-4 text-primary-foreground shadow-[var(--shadow-elegant)]">
          <p className="text-xs font-semibold uppercase tracking-wider text-primary-foreground/80">Total do pedido</p>
          <p className="mt-1.5 text-2xl font-bold tabular-nums">{money(order.total)}</p>
          <p className="text-xs text-primary-foreground/80">{order.items.length} produtos · {order.quantity} unidades</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-soft)]">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Recebido</p>
          <p className="mt-1.5 text-2xl font-bold tabular-nums">{money(order.received_total)}</p>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-200 dark:bg-muted" role="progressbar" aria-valuenow={Math.round(progress)} aria-valuemin={0} aria-valuemax={100} aria-label="Unidades recebidas">
            <div className="h-full rounded-full bg-emerald-500 transition-all" style={{ width: `${progress}%` }} />
          </div>
          <p className="mt-1 text-xs text-muted-foreground">{order.received_quantity} de {order.quantity} unidades</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-soft)]">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {order.status === "closed" ? "Pendente descartado" : "Falta receber"}
          </p>
          <p className="mt-1.5 text-2xl font-bold tabular-nums">{money(pendingValue)}</p>
          <p className="text-xs text-muted-foreground">{pending} unidades</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-soft)]">
          <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <CalendarClock className="h-3.5 w-3.5" />
            Previsão de entrega
          </p>
          <p className="mt-1.5 text-2xl font-bold tabular-nums">{formatDate(order.expected_date)}</p>
          <p className="text-xs text-muted-foreground">
            {order.sent_at ? `Enviado em ${formatDateTime(order.sent_at)}` : "Ainda não enviado"}
          </p>
        </div>
      </section>

      {(order.notes || order.close_reason) && (
        <section className="dash-in space-y-1 rounded-2xl border border-border bg-card p-4 text-sm shadow-[var(--shadow-soft)]">
          {order.notes && <p><span className="font-medium">Observações:</span> {order.notes}</p>}
          {order.close_reason && (
            <p className="text-muted-foreground">
              <span className="font-medium text-foreground">
                {order.status === "canceled" ? "Cancelado" : "Encerrado"} em {formatDateTime(order.closed_at)}:
              </span>{" "}
              {order.close_reason}
            </p>
          )}
        </section>
      )}

      {order.emails.length > 0 && (
        <section className="dash-in rounded-2xl border border-border bg-card p-4 text-sm shadow-[var(--shadow-soft)]">
          <h2 className="mb-2 flex items-center gap-2 font-semibold text-foreground">
            <Mail className="h-4 w-4 text-muted-foreground" />
            E-mails ao fornecedor
          </h2>
          <ul className="space-y-1 text-muted-foreground">
            {order.emails.map((email) => (
              <li key={email.created_at}>
                <span className="font-medium text-foreground">
                  {email.kind === "updated" ? "Pedido atualizado" : email.kind === "resend" ? "Reenvio" : "Pedido enviado"}
                </span>{" "}
                para {email.recipient} em {formatDateTime(email.created_at)}
                {email.sent_by_name && ` por ${email.sent_by_name}`}
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="dash-in overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-soft)]">
        <h2 className="border-b border-border px-4 py-3 font-semibold text-foreground">Itens do pedido</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-100 text-xs text-slate-700 dark:bg-muted dark:text-muted-foreground">
              <tr>
                <th className="px-4 py-2.5 text-left font-semibold">Produto</th>
                <th className="px-3 py-2.5 text-right font-semibold">Pedido</th>
                <th className="px-3 py-2.5 text-right font-semibold">Recebido</th>
                <th className="px-3 py-2.5 text-right font-semibold">Pendente</th>
                <th className="px-3 py-2.5 text-right font-semibold">Custo unitário</th>
                <th className="px-3 py-2.5 text-right font-semibold">Total</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((it) => (
                <tr key={it.id} className="border-t border-border">
                  <td className="px-4 py-2.5">
                    <p className="font-medium text-foreground">{it.product_name}</p>
                    <p className="text-xs text-muted-foreground">
                      {it.sell_in_bulk ? "Granel" : `Estoque atual ${it.stock_quantity}`} · custo atual {money(it.current_cost)}
                    </p>
                  </td>
                  <td className="px-3 py-2.5 text-right tabular-nums">{it.quantity}</td>
                  <td className="px-3 py-2.5 text-right tabular-nums">{it.received_quantity}</td>
                  <td className={`px-3 py-2.5 text-right tabular-nums ${it.pending_quantity > 0 && order.status !== "closed" && order.status !== "canceled" ? "font-semibold text-amber-700 dark:text-amber-400" : "text-muted-foreground"}`}>
                    {it.pending_quantity}
                  </td>
                  <td className="px-3 py-2.5 text-right tabular-nums">{unitMoney(it.unit_cost)}</td>
                  <td className="px-3 py-2.5 text-right font-medium tabular-nums">{money(it.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="dash-in space-y-3">
        <h2 className="font-semibold text-foreground">
          Recebimentos <span className="text-sm font-normal text-muted-foreground">({order.receipts.length})</span>
        </h2>
        {order.receipts.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
            Nenhuma mercadoria recebida ainda.
            {order.can_receive && " Quando a nota chegar, use “Receber mercadoria”."}
          </p>
        ) : (
          order.receipts.map((receipt, index) => (
            <ReceiptCard key={receipt.id} receipt={receipt} index={index} />
          ))
        )}
      </section>

      {order.can_receive && (
        <ReceiveDialog
          key={`${order.received_quantity}-${order.receipts.length}`}
          open={receiving}
          onOpenChange={setReceiving}
          order={order}
        />
      )}

      {order.can_send && (
        <SendOrderDialog open={sending} onOpenChange={setSending} order={order} />
      )}

      <ReasonDialog
        open={closing}
        onOpenChange={setClosing}
        title={`Encerrar o pedido nº ${order.number}?`}
        description={
          <p>
            O pedido fica fechado com o que já foi recebido. As {pending} unidades pendentes
            ({money(pendingValue)}) são descartadas e não poderão mais ser recebidas.
          </p>
        }
        confirmLabel="Encerrar pedido"
        onConfirm={finish("close")}
      />

      <ReasonDialog
        open={canceling}
        onOpenChange={setCanceling}
        title={`Cancelar o pedido nº ${order.number}?`}
        description={<p>Nenhuma mercadoria foi recebida, então nada no estoque ou no financeiro muda.</p>}
        confirmLabel="Cancelar pedido"
        destructive
        onConfirm={finish("cancel")}
      />
    </div>
  );
}
