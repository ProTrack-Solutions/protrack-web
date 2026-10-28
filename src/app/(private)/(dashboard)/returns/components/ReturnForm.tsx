"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  AlertTriangle,
  ArrowLeftRight,
  Loader2,
  Minus,
  PackageX,
  Plus,
  ShieldAlert,
  Trash2,
  Undo2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CASH_REGISTER_KEY } from "@/hooks/useCashRegister";
import { CUSTOMER_CREDIT_KEY, RETURNS_KEY } from "@/hooks/useReturns";
import { Product } from "@/interfaces/products.interface";
import {
  CreateReturnParams,
  RefundMethod,
  ReturnDestination,
  ReturnKind,
  ReturnReason,
  ReturnableSale,
} from "@/interfaces/returns.interface";
import { CreateReturn } from "@/service/returns.service";
import { getApiErrorMessage } from "@/utils/apiError";
import { getPaymentMethodLabel } from "@/utils/paymentMethodFormat";
import { MoneyInput } from "../../cash-register/components/MoneyInput";
import { CustomerPicker } from "./CustomerPicker";
import { ProductPicker } from "./ProductPicker";
import {
  REASONS,
  REFUND_METHODS,
  allocate,
  formatDateTime,
  formatDay,
  lineReturnAmount,
  money,
} from "./format";

interface NewItem {
  product: Product;
  quantity: number;
}

function QuantityStepper({
  value,
  max,
  onChange,
  label,
}: {
  value: number;
  max: number;
  onChange: (value: number) => void;
  label: string;
}) {
  return (
    <div className="inline-flex items-center rounded-lg border border-border">
      <button
        type="button"
        aria-label={`Diminuir ${label}`}
        disabled={value <= 0}
        onClick={() => onChange(Math.max(value - 1, 0))}
        className="flex h-8 w-8 cursor-pointer items-center justify-center text-muted-foreground hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
      >
        <Minus className="h-3.5 w-3.5" />
      </button>
      <input
        type="number"
        inputMode="numeric"
        min={0}
        max={max}
        value={value}
        aria-label={label}
        onChange={(e) => onChange(Math.min(Math.max(Math.trunc(Number(e.target.value) || 0), 0), max))}
        className="h-8 w-12 border-x border-border bg-transparent text-center text-sm tabular-nums outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
      />
      <button
        type="button"
        aria-label={`Aumentar ${label}`}
        disabled={value >= max}
        onClick={() => onChange(Math.min(value + 1, max))}
        className="flex h-8 w-8 cursor-pointer items-center justify-center text-muted-foreground hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
      >
        <Plus className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

function Row({ label, value, strong, tone }: { label: string; value: string; strong?: boolean; tone?: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3 py-1">
      <span className={strong ? "text-sm font-semibold text-foreground" : "text-sm text-muted-foreground"}>{label}</span>
      <span className={`tabular-nums ${strong ? "text-lg font-bold" : "text-sm font-medium"} ${tone ?? "text-foreground"}`}>
        {value}
      </span>
    </div>
  );
}

export function ReturnForm({ sale }: { sale: ReturnableSale }) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [kind, setKind] = useState<ReturnKind>("return");
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [damaged, setDamaged] = useState<Record<string, boolean>>({});
  const [newItems, setNewItems] = useState<NewItem[]>([]);
  const [reason, setReason] = useState<ReturnReason | "">("");
  const [notes, setNotes] = useState("");
  const [overrideReason, setOverrideReason] = useState("");
  const [destination, setDestination] = useState<ReturnDestination>("credit");
  const [refundMethod, setRefundMethod] = useState<RefundMethod | "">("");
  const [customer, setCustomer] = useState<{ id: string; name: string } | null>(null);
  const [differenceMethod, setDifferenceMethod] = useState<RefundMethod | "">("");
  const [amountReceived, setAmountReceived] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const blocked = !sale.within_window && !sale.can_override;

  const returnedTotal = useMemo(
    () =>
      Math.round(
        sale.items.reduce(
          (sum, it) =>
            sum +
            lineReturnAmount(it.net_total, it.returned_total, it.quantity, it.returned_quantity, quantities[it.sale_item_id] ?? 0) *
              100,
          0,
        ),
      ) / 100,
    [sale.items, quantities],
  );
  const returnedUnits = Object.values(quantities).reduce((s, q) => s + q, 0);

  const exchangeTotal =
    kind === "exchange"
      ? Math.round(newItems.reduce((s, it) => s + it.product.sale_price * it.quantity * 100, 0)) / 100
      : 0;

  const alloc = allocate(returnedTotal, exchangeTotal, sale.open_debt);
  const hasCustomer = !!sale.customer_id;
  const change = Math.max(amountReceived - alloc.difference, 0);

  const problems: string[] = [];
  if (returnedUnits === 0) problems.push("Escolha os itens que o cliente está devolvendo.");
  if (kind === "exchange" && newItems.length === 0) problems.push("Adicione o que o cliente vai levar na troca.");
  if (!reason) problems.push("Informe o motivo.");
  if (!sale.within_window && sale.can_override && !overrideReason.trim())
    problems.push("Explique por que a troca está sendo aceita fora do prazo.");
  if (alloc.rest > 0 && destination === "credit" && !hasCustomer && !customer)
    problems.push("Escolha o cliente que vai receber o vale-troca.");
  if (alloc.rest > 0 && destination === "refund" && !refundMethod)
    problems.push("Escolha como o dinheiro será devolvido.");
  if (alloc.difference > 0 && !differenceMethod) problems.push("Escolha como o cliente paga a diferença.");
  if (alloc.difference > 0 && differenceMethod === "cash" && amountReceived > 0 && amountReceived < alloc.difference)
    problems.push("O valor recebido é menor que a diferença.");

  const submit = async () => {
    if (problems.length > 0 || blocked) return;
    setSubmitting(true);

    const payload: CreateReturnParams = {
      sale_id: sale.sale_id,
      kind,
      reason: reason as ReturnReason,
      items: sale.items
        .filter((it) => (quantities[it.sale_item_id] ?? 0) > 0)
        .map((it) => ({
          sale_item_id: it.sale_item_id,
          quantity: quantities[it.sale_item_id],
          restock: !damaged[it.sale_item_id],
        })),
      notes: notes.trim() || undefined,
      override_reason: !sale.within_window ? overrideReason.trim() : undefined,
    };
    if (kind === "exchange") {
      payload.new_items = newItems.map((it) => ({ product_id: it.product.id, quantity: it.quantity }));
    }
    if (alloc.rest > 0) {
      payload.destination = destination;
      if (destination === "refund") payload.refund_method = refundMethod as RefundMethod;
    }
    if (!hasCustomer && customer) payload.customer_id = customer.id;
    if (alloc.difference > 0) {
      payload.difference_method = differenceMethod as RefundMethod;
      if (differenceMethod === "cash" && amountReceived > 0) payload.amount_received = amountReceived;
    }

    try {
      const created = await CreateReturn(payload);
      toast.success(
        kind === "exchange" ? `Troca nº ${created.number} registrada.` : `Devolução nº ${created.number} registrada.`,
      );
      // A devolução mexe em estoque, parcelas, vale-troca, caixa e lista de vendas
      queryClient.invalidateQueries({ queryKey: [RETURNS_KEY] });
      queryClient.invalidateQueries({ queryKey: [CUSTOMER_CREDIT_KEY] });
      queryClient.invalidateQueries({ queryKey: [CASH_REGISTER_KEY] });
      queryClient.invalidateQueries({ queryKey: ["sales"] });
      queryClient.invalidateQueries({ queryKey: ["products-select"] });
      queryClient.invalidateQueries({ queryKey: ["products-stock"] });
      queryClient.invalidateQueries({ queryKey: ["accounts-receivable"] });
      router.push(`/returns/${created.id}`);
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Não foi possível registrar a devolução."));
      setSubmitting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
      <div className="min-w-0 space-y-6">
        {/* Venda */}
        <section className="dash-in rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-soft)]">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">Venda</p>
              <p className="mt-1 text-lg font-semibold text-foreground">
                {sale.customer_name || "Consumidor final"}
              </p>
              <p className="text-sm text-muted-foreground">
                {formatDateTime(sale.created_at)} · {getPaymentMethodLabel(sale.payment_method)} ·{" "}
                <span className="font-mono">{sale.sale_id.slice(0, 8)}</span>
              </p>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold tabular-nums">{money(sale.total_amount)}</p>
              {sale.open_debt > 0 && (
                <p className="text-xs text-amber-800 dark:text-amber-300">{money(sale.open_debt)} ainda em aberto</p>
              )}
              {sale.customer_credit > 0 && (
                <p className="text-xs text-pink-700 dark:text-pink-300">Vale-troca atual: {money(sale.customer_credit)}</p>
              )}
            </div>
          </div>

          {!sale.within_window && (
            <div
              className={`mt-4 flex items-start gap-3 rounded-xl p-3 text-sm ${
                sale.can_override
                  ? "bg-amber-50 text-amber-900 dark:bg-amber-500/10 dark:text-amber-200"
                  : "bg-red-50 text-red-900 dark:bg-red-500/10 dark:text-red-200"
              }`}
            >
              <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" />
              <div className="flex-1 space-y-2">
                <p>
                  O prazo de troca ({sale.window_days} dias) terminou em {formatDay(sale.deadline)}.{" "}
                  {sale.can_override
                    ? "Como administrador, você pode aceitar mesmo assim informando o motivo."
                    : "Só um administrador pode aceitar esta troca."}
                </p>
                {sale.can_override && (
                  <Input
                    value={overrideReason}
                    onChange={(e) => setOverrideReason(e.target.value)}
                    placeholder="Motivo da exceção (ex.: cliente antigo, defeito de fábrica)"
                    maxLength={500}
                    className="bg-background"
                  />
                )}
              </div>
            </div>
          )}
          {sale.within_window && sale.deadline && (
            <p className="mt-3 text-xs text-muted-foreground">Prazo de troca até {formatDay(sale.deadline)}.</p>
          )}
        </section>

        {/* Tipo */}
        <div role="radiogroup" aria-label="Tipo" className="grid grid-cols-2 gap-3">
          {(
            [
              { value: "return", icon: Undo2, title: "Devolução", text: "O cliente devolve e recebe vale-troca ou o dinheiro" },
              { value: "exchange", icon: ArrowLeftRight, title: "Troca", text: "O cliente devolve e leva outros produtos" },
            ] as const
          ).map((option) => {
            const active = kind === option.value;
            return (
              <button
                key={option.value}
                type="button"
                role="radio"
                aria-checked={active}
                disabled={blocked}
                onClick={() => setKind(option.value)}
                className={`flex cursor-pointer items-start gap-3 rounded-2xl border p-4 text-left transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${
                  active
                    ? "border-blue-600 bg-blue-50 ring-1 ring-blue-600 dark:bg-blue-500/10"
                    : "border-border bg-card hover:bg-slate-50 dark:hover:bg-muted/50"
                }`}
              >
                <option.icon className={`mt-0.5 h-5 w-5 ${active ? "text-blue-700 dark:text-blue-300" : "text-muted-foreground"}`} />
                <span>
                  <span className="block font-semibold text-foreground">{option.title}</span>
                  <span className="block text-sm text-muted-foreground">{option.text}</span>
                </span>
              </button>
            );
          })}
        </div>

        {/* Itens devolvidos */}
        <section className="dash-in overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-soft)]">
          <div className="border-b border-border p-4">
            <h2 className="font-semibold text-foreground">O que o cliente está devolvendo</h2>
            <p className="text-sm text-muted-foreground">O valor é o que ele pagou, já com o desconto da venda.</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-100 text-xs text-slate-700 dark:bg-muted dark:text-muted-foreground">
                <tr>
                  <th className="px-4 py-2.5 text-left font-semibold">Produto</th>
                  <th className="px-3 py-2.5 text-right font-semibold">Pago (un.)</th>
                  <th className="px-3 py-2.5 text-center font-semibold">Devolver</th>
                  <th className="px-3 py-2.5 text-center font-semibold">Avariado</th>
                  <th className="px-4 py-2.5 text-right font-semibold">Valor</th>
                </tr>
              </thead>
              <tbody>
                {sale.items.map((it) => {
                  const qty = quantities[it.sale_item_id] ?? 0;
                  const amount = lineReturnAmount(it.net_total, it.returned_total, it.quantity, it.returned_quantity, qty);
                  return (
                    <tr key={it.sale_item_id} className={`border-t border-border ${it.available === 0 ? "bg-slate-50 text-muted-foreground dark:bg-muted/30" : ""}`}>
                      <td className="px-4 py-3">
                        <p className="font-medium text-foreground">{it.product_name}</p>
                        <p className="text-xs text-muted-foreground">
                          Comprou {it.quantity}
                          {it.returned_quantity > 0 && ` · já devolveu ${it.returned_quantity}`}
                        </p>
                      </td>
                      <td className="px-3 py-3 text-right tabular-nums">
                        {money(it.unit_amount)}
                        {it.unit_amount < it.unit_price && (
                          <span className="block text-xs text-muted-foreground line-through">{money(it.unit_price)}</span>
                        )}
                      </td>
                      <td className="px-3 py-3 text-center">
                        {it.available === 0 ? (
                          <span className="text-xs">Tudo devolvido</span>
                        ) : (
                          <QuantityStepper
                            value={qty}
                            max={it.available}
                            label={`quantidade de ${it.product_name}`}
                            onChange={(v) => setQuantities((prev) => ({ ...prev, [it.sale_item_id]: v }))}
                          />
                        )}
                      </td>
                      <td className="px-3 py-3 text-center">
                        {it.sell_in_bulk ? (
                          <span className="text-xs text-muted-foreground" title="Produto a granel não controla estoque">—</span>
                        ) : (
                          <Checkbox
                            checked={!!damaged[it.sale_item_id]}
                            disabled={qty === 0}
                            onCheckedChange={(v) => setDamaged((prev) => ({ ...prev, [it.sale_item_id]: v === true }))}
                            aria-label={`${it.product_name} avariado (não volta ao estoque)`}
                            title="Marque se a peça está com defeito: ela não volta ao estoque"
                          />
                        )}
                      </td>
                      <td className="px-4 py-3 text-right font-semibold tabular-nums">{qty > 0 ? money(amount) : "—"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {Object.entries(damaged).some(([id, v]) => v && (quantities[id] ?? 0) > 0) && (
            <p className="flex items-center gap-2 border-t border-border bg-slate-50 px-4 py-2.5 text-xs text-slate-700 dark:bg-muted/40 dark:text-muted-foreground">
              <PackageX className="h-4 w-4" />
              Peças marcadas como avariadas não voltam ao estoque.
            </p>
          )}
        </section>

        {/* Itens novos */}
        {kind === "exchange" && (
          <section className="dash-in overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-soft)]">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border p-4">
              <div>
                <h2 className="font-semibold text-foreground">O que o cliente vai levar</h2>
                <p className="text-sm text-muted-foreground">Pelo preço de venda atual.</p>
              </div>
              <ProductPicker
                selectedIds={newItems.map((it) => it.product.id)}
                onSelect={(product) => setNewItems((prev) => [...prev, { product, quantity: 1 }])}
              />
            </div>
            {newItems.length === 0 ? (
              <p className="px-4 py-8 text-center text-sm text-muted-foreground">
                Nenhum produto ainda. Use &ldquo;Adicionar produto&rdquo;.
              </p>
            ) : (
              <ul className="divide-y divide-border">
                {newItems.map((it, index) => {
                  const max = it.product.sell_in_bulk ? 9999 : it.product.quantity;
                  return (
                    <li key={it.product.id} className="flex flex-wrap items-center gap-3 px-4 py-3">
                      <span className="min-w-0 flex-1">
                        <span className="block font-medium text-foreground">{it.product.name}</span>
                        <span className="block text-xs text-muted-foreground">
                          {money(it.product.sale_price)} cada
                          {!it.product.sell_in_bulk && ` · estoque ${it.product.quantity}`}
                        </span>
                      </span>
                      <QuantityStepper
                        value={it.quantity}
                        max={max}
                        label={`quantidade de ${it.product.name}`}
                        onChange={(v) =>
                          setNewItems((prev) =>
                            v === 0 ? prev.filter((_, i) => i !== index) : prev.map((p, i) => (i === index ? { ...p, quantity: v } : p)),
                          )
                        }
                      />
                      <span className="w-24 text-right font-semibold tabular-nums">
                        {money(it.product.sale_price * it.quantity)}
                      </span>
                      <button
                        type="button"
                        aria-label={`Remover ${it.product.name}`}
                        onClick={() => setNewItems((prev) => prev.filter((_, i) => i !== index))}
                        className="cursor-pointer rounded-md p-1.5 text-muted-foreground hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-500/10 dark:hover:text-red-400"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
        )}

        {/* Motivo */}
        <section className="dash-in grid grid-cols-1 gap-4 rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-soft)] sm:grid-cols-[14rem_minmax(0,1fr)]">
          <div className="space-y-1.5">
            <Label htmlFor="return-reason">Motivo</Label>
            <Select value={reason} onValueChange={(v) => setReason(v as ReturnReason)}>
              <SelectTrigger id="return-reason" className="w-full">
                <SelectValue placeholder="Escolha o motivo" />
              </SelectTrigger>
              <SelectContent>
                {REASONS.map((r) => (
                  <SelectItem key={r.value} value={r.value}>
                    {r.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="return-notes">Observação (opcional)</Label>
            <Textarea
              id="return-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              maxLength={500}
              rows={2}
              placeholder="Ex.: costura soltando na manga"
            />
          </div>
        </section>
      </div>

      {/* Resumo */}
      <aside className="lg:sticky lg:top-6 lg:self-start">
        <div className="dash-in space-y-4 rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-soft)]">
          <h2 className="font-semibold text-foreground">Resumo</h2>

          <div className="divide-y divide-border">
            <div className="pb-2">
              <Row label={`Devolvido (${returnedUnits} ${returnedUnits === 1 ? "item" : "itens"})`} value={money(returnedTotal)} />
              {kind === "exchange" && <Row label="Itens novos" value={money(exchangeTotal)} />}
            </div>
            <div className="py-2">
              {alloc.debtReduction > 0 && (
                <Row label="Abatido das parcelas em aberto" value={money(alloc.debtReduction)} tone="text-amber-800 dark:text-amber-300" />
              )}
              {alloc.difference > 0 ? (
                <Row label="Cliente paga a diferença" value={money(alloc.difference)} strong tone="text-blue-700 dark:text-blue-300" />
              ) : alloc.rest > 0 ? (
                <Row
                  label={destination === "credit" ? "Vale-troca para o cliente" : "Devolver ao cliente"}
                  value={money(alloc.rest)}
                  strong
                  tone={destination === "credit" ? "text-pink-700 dark:text-pink-300" : "text-emerald-700 dark:text-emerald-400"}
                />
              ) : (
                <Row label="Sem diferença" value={money(0)} strong />
              )}
            </div>
          </div>

          {sale.open_debt > 0 && returnedTotal > 0 && (
            <p className="rounded-lg bg-amber-50 p-3 text-xs text-amber-900 dark:bg-amber-500/10 dark:text-amber-200">
              A venda tem {money(sale.open_debt)} em parcelas abertas: o valor devolvido abate delas antes de virar vale ou
              dinheiro.
            </p>
          )}

          {alloc.rest > 0 && (
            <div className="space-y-3">
              <div role="radiogroup" aria-label="Destino do valor" className="grid grid-cols-2 gap-2">
                {(
                  [
                    { value: "credit", label: "Vale-troca" },
                    { value: "refund", label: "Dinheiro de volta" },
                  ] as const
                ).map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    role="radio"
                    aria-checked={destination === option.value}
                    onClick={() => setDestination(option.value)}
                    className={`cursor-pointer rounded-lg border px-3 py-2 text-sm font-semibold transition-colors ${
                      destination === option.value
                        ? "border-blue-600 bg-blue-50 text-blue-800 dark:bg-blue-500/10 dark:text-blue-200"
                        : "border-border text-muted-foreground hover:bg-slate-50 hover:text-foreground dark:hover:bg-muted/50"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>

              {destination === "credit" &&
                (hasCustomer ? (
                  <p className="text-xs text-muted-foreground">
                    O vale fica no cadastro de {sale.customer_name} e pode ser usado em qualquer venda.
                  </p>
                ) : (
                  <div className="space-y-1.5">
                    <Label>Cliente que recebe o vale</Label>
                    <CustomerPicker value={customer} onChange={setCustomer} />
                    <p className="text-xs text-muted-foreground">A venda foi sem cliente: escolha ou cadastre um.</p>
                  </div>
                ))}

              {destination === "refund" && (
                <div className="space-y-1.5">
                  <Label htmlFor="refund-method">Como devolver</Label>
                  <Select value={refundMethod} onValueChange={(v) => setRefundMethod(v as RefundMethod)}>
                    <SelectTrigger id="refund-method" className="w-full">
                      <SelectValue placeholder="Escolha a forma" />
                    </SelectTrigger>
                    <SelectContent>
                      {REFUND_METHODS.map((m) => (
                        <SelectItem key={m.value} value={m.value}>
                          {m.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {refundMethod === "cash" && (
                    <p className="text-xs text-muted-foreground">Sai da gaveta do seu caixa.</p>
                  )}
                </div>
              )}
            </div>
          )}

          {alloc.difference > 0 && (
            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label htmlFor="difference-method">Forma de pagamento da diferença</Label>
                <Select
                  value={differenceMethod}
                  onValueChange={(v) => {
                    setDifferenceMethod(v as RefundMethod);
                    setAmountReceived(0);
                  }}
                >
                  <SelectTrigger id="difference-method" className="w-full">
                    <SelectValue placeholder="Escolha a forma" />
                  </SelectTrigger>
                  <SelectContent>
                    {REFUND_METHODS.map((m) => (
                      <SelectItem key={m.value} value={m.value}>
                        {m.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {differenceMethod === "cash" && (
                <div className="space-y-1.5">
                  <Label htmlFor="amount-received">Valor recebido (opcional)</Label>
                  <MoneyInput id="amount-received" value={amountReceived} onChange={setAmountReceived} />
                  {amountReceived > 0 && amountReceived >= alloc.difference && (
                    <p className="text-sm">
                      Troco: <span className="font-bold tabular-nums">{money(change)}</span>
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          {blocked ? (
            <p className="flex items-start gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-900 dark:bg-red-500/10 dark:text-red-200">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
              Fora do prazo de troca. Peça para um administrador registrar.
            </p>
          ) : (
            problems.length > 0 &&
            returnedUnits > 0 && (
              <ul className="space-y-1 text-xs text-muted-foreground">
                {problems.map((p) => (
                  <li key={p}>• {p}</li>
                ))}
              </ul>
            )
          )}

          <Button
            type="button"
            className="h-11 w-full cursor-pointer"
            disabled={blocked || problems.length > 0 || submitting}
            onClick={submit}
          >
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : kind === "exchange" ? <ArrowLeftRight className="h-4 w-4" /> : <Undo2 className="h-4 w-4" />}
            {kind === "exchange" ? "Registrar troca" : "Registrar devolução"}
          </Button>
        </div>
      </aside>
    </div>
  );
}
