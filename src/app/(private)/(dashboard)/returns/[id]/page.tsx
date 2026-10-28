"use client";

import { use } from "react";
import Link from "next/link";
import { AlertCircle, ArrowLeft, PackageX, Plus, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/DashCard";
import { useReturn } from "@/hooks/useReturns";
import { getApiErrorMessage } from "@/utils/apiError";
import { KindBadge } from "../components/KindBadge";
import { formatDateTime, methodLabel, money, reasonLabel } from "../components/format";

function Line({ label, value, tone }: { label: string; value: string; tone?: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3 py-1.5">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className={`text-sm font-semibold tabular-nums ${tone ?? "text-foreground"}`}>{value}</span>
    </div>
  );
}

export default function ReturnDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: r, isLoading, isError, error, refetch } = useReturn(id);

  if (isLoading) {
    return (
      <div className="space-y-4 p-6">
        <Skeleton className="h-10 w-72" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (isError || !r) {
    return (
      <div className="p-6">
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-border bg-card p-10 text-center">
          <AlertCircle className="h-8 w-8 text-destructive" />
          <p className="font-medium">{getApiErrorMessage(error, "Não foi possível carregar a devolução.")}</p>
          <Button onClick={() => refetch()} className="cursor-pointer">Tentar novamente</Button>
        </div>
      </div>
    );
  }

  const exchange = r.kind === "exchange";

  return (
    <div className="space-y-6 p-6">
      <div className="dash-in flex flex-wrap items-end justify-between gap-4">
        <div>
          <Link
            href="/returns"
            className="mb-2 inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Trocas e devoluções
          </Link>
          <h1 className="flex flex-wrap items-center gap-3 text-3xl font-bold tracking-tight text-foreground">
            {exchange ? "Troca" : "Devolução"} nº {r.number}
            <KindBadge kind={r.kind} />
          </h1>
          <p className="mt-1 text-muted-foreground">
            {formatDateTime(r.created_at)} por {r.created_by_name || "—"} · {r.customer_name || "Consumidor final"}
          </p>
        </div>
        <Button asChild className="h-10">
          <Link href="/returns/new">
            <Plus className="h-4 w-4" />
            Nova troca/devolução
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="min-w-0 space-y-6">
          <section className="dash-in overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-soft)]">
            <div className="border-b border-border p-4">
              <h2 className="font-semibold text-foreground">Itens devolvidos</h2>
              <p className="text-sm text-muted-foreground">
                Da venda de {formatDateTime(r.sale_created_at)} ({money(r.sale_total)}) ·{" "}
                <span className="font-mono">{r.sale_id.slice(0, 8)}</span>
              </p>
            </div>
            <table className="w-full text-sm">
              <thead className="bg-slate-100 text-xs text-slate-700 dark:bg-muted dark:text-muted-foreground">
                <tr>
                  <th className="px-4 py-2.5 text-left font-semibold">Produto</th>
                  <th className="px-3 py-2.5 text-right font-semibold">Qtd.</th>
                  <th className="px-3 py-2.5 text-right font-semibold">Pago (un.)</th>
                  <th className="px-4 py-2.5 text-right font-semibold">Valor</th>
                </tr>
              </thead>
              <tbody>
                {r.items.map((it) => (
                  <tr key={it.product_id} className="border-t border-border">
                    <td className="px-4 py-3">
                      <p className="font-medium">{it.product_name}</p>
                      {!it.restock && (
                        <p className="flex items-center gap-1 text-xs text-red-700 dark:text-red-400">
                          <PackageX className="h-3.5 w-3.5" /> Avariado: não voltou ao estoque
                        </p>
                      )}
                    </td>
                    <td className="px-3 py-3 text-right tabular-nums">{it.quantity}</td>
                    <td className="px-3 py-3 text-right tabular-nums">{money(it.unit_amount)}</td>
                    <td className="px-4 py-3 text-right font-semibold tabular-nums">{money(it.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          {exchange && (
            <section className="dash-in overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-soft)]">
              <div className="border-b border-border p-4">
                <h2 className="font-semibold text-foreground">Levou na troca</h2>
                {r.exchange_sale_id && (
                  <p className="text-sm text-muted-foreground">
                    Lançado como venda <span className="font-mono">{r.exchange_sale_id.slice(0, 8)}</span>
                  </p>
                )}
              </div>
              <table className="w-full text-sm">
                <thead className="bg-slate-100 text-xs text-slate-700 dark:bg-muted dark:text-muted-foreground">
                  <tr>
                    <th className="px-4 py-2.5 text-left font-semibold">Produto</th>
                    <th className="px-3 py-2.5 text-right font-semibold">Qtd.</th>
                    <th className="px-3 py-2.5 text-right font-semibold">Preço</th>
                    <th className="px-4 py-2.5 text-right font-semibold">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {r.new_items.map((it) => (
                    <tr key={it.product_id} className="border-t border-border">
                      <td className="px-4 py-3 font-medium">{it.product_name}</td>
                      <td className="px-3 py-3 text-right tabular-nums">{it.quantity}</td>
                      <td className="px-3 py-3 text-right tabular-nums">{money(it.unit_price)}</td>
                      <td className="px-4 py-3 text-right font-semibold tabular-nums">{money(it.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          )}

          <section className="dash-in rounded-2xl border border-border bg-card p-5 text-sm shadow-[var(--shadow-soft)]">
            <p>
              <span className="text-muted-foreground">Motivo:</span>{" "}
              <span className="font-medium">{reasonLabel(r.reason)}</span>
            </p>
            {r.notes && (
              <p className="mt-1">
                <span className="text-muted-foreground">Observação:</span> {r.notes}
              </p>
            )}
            {r.out_of_window && (
              <p className="mt-3 flex items-start gap-2 rounded-lg bg-amber-50 p-3 text-amber-900 dark:bg-amber-500/10 dark:text-amber-200">
                <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" />
                Aceita fora do prazo de troca{r.override_reason ? `: “${r.override_reason}”` : ""}.
              </p>
            )}
          </section>
        </div>

        <aside className="lg:sticky lg:top-6 lg:self-start">
          <div className="dash-in rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-soft)]">
            <h2 className="mb-2 font-semibold text-foreground">Valores</h2>
            <div className="divide-y divide-border">
              <div className="pb-2">
                <Line label="Valor devolvido" value={money(r.returned_total)} />
                {exchange && <Line label="Itens novos" value={money(r.exchange_total)} />}
              </div>
              <div className="pt-2">
                {exchange && r.exchange_credit > 0 && (
                  <Line label="Usado na troca" value={money(r.exchange_credit)} />
                )}
                {r.difference_paid > 0 && (
                  <Line
                    label={`Diferença paga (${methodLabel(r.difference_method)})`}
                    value={money(r.difference_paid)}
                    tone="text-blue-700 dark:text-blue-300"
                  />
                )}
                {r.debt_reduction > 0 && (
                  <Line label="Abatido das parcelas" value={money(r.debt_reduction)} tone="text-amber-800 dark:text-amber-300" />
                )}
                {r.credit_amount > 0 && (
                  <Line label="Vale-troca gerado" value={money(r.credit_amount)} tone="text-pink-700 dark:text-pink-300" />
                )}
                {r.refund_amount > 0 && (
                  <Line
                    label={`Devolvido em ${methodLabel(r.refund_method).toLowerCase()}`}
                    value={money(r.refund_amount)}
                    tone="text-emerald-700 dark:text-emerald-400"
                  />
                )}
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
