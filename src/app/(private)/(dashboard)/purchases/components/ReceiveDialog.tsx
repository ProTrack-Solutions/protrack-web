"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { AlertTriangle, Loader2, PackageCheck, Wand2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
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
import { useBillsCategories } from "@/hooks/useBillsCategories";
import { usePaymentMethods } from "@/hooks/usePaymentMethods";
import { usePurchaseOrderUpdated } from "@/hooks/usePurchases";
import {
  InstallmentParams,
  PurchaseOrderDetail,
} from "@/interfaces/purchases.interface";
import { ReceivePurchaseOrder } from "@/service/purchases.service";
import { getApiErrorMessage } from "@/utils/apiError";
import {
  formatDate,
  margin,
  money,
  percent,
  round2,
  splitInstallments,
  todayISO,
  addMonths,
  unitMoney,
} from "./format";

interface ReceiveDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: PurchaseOrderDetail;
}

interface LineState {
  quantity: number;
  unitCost: number;
  /** Preço de venda digitado; null mantém o atual */
  salePrice: number | null;
}

const NONE = "none";

const INTERVALS = [
  { value: "30", label: "Mensal" },
  { value: "15", label: "A cada 15 dias" },
  { value: "7", label: "Semanal" },
];

const round4 = (v: number) => Math.round(v * 10000) / 10000;

/** Mesma conta do backend: rateio proporcional ao valor de cada item */
function allocate(
  lines: { quantity: number; unitCost: number }[],
  extra: number,
) {
  const itemsTotal = lines.reduce((s, l) => s + l.quantity * l.unitCost, 0);
  const quantity = lines.reduce((s, l) => s + l.quantity, 0);
  return lines.map((l) => {
    if (l.quantity <= 0) return l.unitCost;
    const weight =
      itemsTotal > 0
        ? (l.quantity * l.unitCost) / itemsTotal
        : quantity > 0
          ? l.quantity / quantity
          : 0;
    return round4(Math.max(l.unitCost + (extra * weight) / l.quantity, 0));
  });
}

function averageCost(
  stock: number,
  current: number,
  qty: number,
  landed: number,
  bulk: boolean,
) {
  const base = Math.max(stock, 0);
  if (bulk || base === 0 || qty <= 0) return round2(landed);
  return round2((base * current + qty * landed) / (base + qty));
}

export function ReceiveDialog({ open, onOpenChange, order }: ReceiveDialogProps) {
  const onUpdated = usePurchaseOrderUpdated();
  const { billsCategories } = useBillsCategories();
  const { paymentMethods } = usePaymentMethods();

  // O pai remonta o diálogo (key) quando o pedido muda: o estado inicial
  // sempre parte das pendências atuais
  const pendingItems = useMemo(
    () => order.items.filter((it) => it.pending_quantity > 0),
    [order.items],
  );

  const initialLines = () =>
    Object.fromEntries(
      pendingItems.map((it) => [
        it.id,
        { quantity: it.pending_quantity, unitCost: it.unit_cost, salePrice: null },
      ]),
    ) as Record<string, LineState>;

  const [lines, setLines] = useState<Record<string, LineState>>(initialLines);
  const [receivedAt, setReceivedAt] = useState(todayISO);
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [invoiceSeries, setInvoiceSeries] = useState("");
  const [invoiceKey, setInvoiceKey] = useState("");
  const [freight, setFreight] = useState(0);
  const [otherExpenses, setOtherExpenses] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [notes, setNotes] = useState("");
  const [installmentsCount, setInstallmentsCount] = useState(1);
  const [firstDue, setFirstDue] = useState(() => addMonths(todayISO(), 1));
  const [intervalDays, setIntervalDays] = useState("30");
  const [custom, setCustom] = useState<InstallmentParams[] | null>(null);
  const [categoryId, setCategoryId] = useState(NONE);
  const [paymentMethodId, setPaymentMethodId] = useState(NONE);
  const [submitting, setSubmitting] = useState(false);

  const updateLine = (id: string, patch: Partial<LineState>) =>
    setLines((current) => ({ ...current, [id]: { ...current[id], ...patch } }));

  const rows = useMemo(() => {
    const selected = pendingItems.map((it) => ({
      item: it,
      line: lines[it.id],
    }));
    const landed = allocate(
      selected.map(({ line }) => ({
        quantity: line.quantity,
        unitCost: line.unitCost,
      })),
      freight + otherExpenses - discount,
    );
    return selected.map(({ item, line }, i) => {
      const newCost =
        line.quantity > 0
          ? averageCost(item.stock_quantity, item.current_cost, line.quantity, landed[i], item.sell_in_bulk)
          : item.current_cost;
      const price = line.salePrice ?? item.sale_price;
      return {
        item,
        line,
        landed: landed[i],
        newCost,
        currentMargin: margin(item.current_cost, item.sale_price),
        newMargin: margin(newCost, price),
        // Preço que mantém a margem atual sobre o novo custo
        suggestedPrice:
          item.sale_price > 0 && item.current_cost < item.sale_price
            ? round2(newCost / (1 - margin(item.current_cost, item.sale_price) / 100))
            : null,
      };
    });
  }, [pendingItems, lines, freight, otherExpenses, discount]);

  const receiving = rows.filter((r) => r.line.quantity > 0);
  const itemsTotal = round2(
    receiving.reduce((s, r) => s + r.line.quantity * r.line.unitCost, 0),
  );
  const total = round2(itemsTotal + freight + otherExpenses - discount);

  const generated = useMemo(
    () =>
      total > 0
        ? splitInstallments(total, installmentsCount, firstDue, Number(intervalDays))
        : [],
    [total, installmentsCount, firstDue, intervalDays],
  );
  const installments = custom ?? generated;
  const installmentsSum = round2(installments.reduce((s, i) => s + i.amount, 0));
  const installmentsMismatch = total > 0 && Math.round(installmentsSum * 100) !== Math.round(total * 100);

  const overPending = rows.find((r) => r.line.quantity > r.item.pending_quantity);
  const errors = [
    receiving.length === 0 && "Informe a quantidade recebida de ao menos um item.",
    overPending &&
      `${overPending.item.product_name}: o pendente é ${overPending.item.pending_quantity}.`,
    total < 0 && "O desconto não pode ser maior que o total da nota.",
    invoiceKey && !/^\d{44}$/.test(invoiceKey) && "A chave da NF-e tem 44 dígitos.",
    installmentsMismatch &&
      `A soma das parcelas (${money(installmentsSum)}) difere do total (${money(total)}).`,
    installments.some((i) => !i.due_date || !(i.amount > 0)) &&
      "Todas as parcelas precisam de vencimento e valor.",
  ].filter(Boolean) as string[];

  const reset = () => {
    setLines(initialLines());
    setReceivedAt(todayISO());
    setInvoiceNumber("");
    setInvoiceSeries("");
    setInvoiceKey("");
    setFreight(0);
    setOtherExpenses(0);
    setDiscount(0);
    setNotes("");
    setInstallmentsCount(1);
    setFirstDue(addMonths(todayISO(), 1));
    setIntervalDays("30");
    setCustom(null);
    setCategoryId(NONE);
    setPaymentMethodId(NONE);
  };

  const handleOpenChange = (next: boolean) => {
    if (submitting) return;
    if (!next) reset();
    onOpenChange(next);
  };

  const editInstallment = (index: number, patch: Partial<InstallmentParams>) =>
    setCustom(installments.map((inst, i) => (i === index ? { ...inst, ...patch } : inst)));

  const submit = async () => {
    if (errors.length > 0 || submitting) return;
    setSubmitting(true);
    try {
      const updated = await ReceivePurchaseOrder(order.id, {
        received_at: receivedAt,
        invoice_number: invoiceNumber.trim() || undefined,
        invoice_series: invoiceSeries.trim() || undefined,
        invoice_key: invoiceKey || undefined,
        freight,
        other_expenses: otherExpenses,
        discount,
        notes: notes.trim() || undefined,
        items: receiving.map((r) => ({
          order_item_id: r.item.id,
          quantity: r.line.quantity,
          unit_cost: r.line.unitCost,
          sale_price:
            r.line.salePrice !== null && r.line.salePrice !== r.item.sale_price
              ? r.line.salePrice
              : undefined,
        })),
        installments: total > 0 ? installments : [],
        bill_category_id: categoryId === NONE ? undefined : categoryId,
        payment_method_id: paymentMethodId === NONE ? undefined : paymentMethodId,
      });
      onUpdated(updated);
      toast.success(
        updated.status === "received"
          ? "Mercadoria recebida! Pedido concluído."
          : "Recebimento registrado! O restante continua pendente.",
      );
      reset();
      onOpenChange(false);
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Não foi possível registrar o recebimento."));
    } finally {
      setSubmitting(false);
    }
  };

  const moneyInput = (value: number, onChange: (v: number) => void, id: string) => (
    <Input
      id={id}
      type="number"
      min={0}
      step="0.01"
      inputMode="decimal"
      value={value || ""}
      placeholder="0,00"
      onChange={(e) => onChange(Math.max(0, Number(e.target.value) || 0))}
      className="h-9 text-right"
    />
  );

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-5xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <PackageCheck className="h-5 w-5 text-blue-700 dark:text-blue-300" />
            Receber mercadoria · Pedido nº {order.number}
          </DialogTitle>
          <DialogDescription>
            {order.vendor_name}. A entrada soma o estoque, recalcula o custo médio e
            gera as contas a pagar.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Nota fiscal */}
          <section className="grid gap-3 sm:grid-cols-4">
            <div className="space-y-1.5">
              <Label htmlFor="received-at">Recebido em</Label>
              <Input
                id="received-at"
                type="date"
                value={receivedAt}
                max={todayISO()}
                onChange={(e) => setReceivedAt(e.target.value)}
                className="h-9"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="invoice-number">Nº da nota</Label>
              <Input
                id="invoice-number"
                value={invoiceNumber}
                maxLength={20}
                onChange={(e) => setInvoiceNumber(e.target.value)}
                className="h-9"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="invoice-series">Série</Label>
              <Input
                id="invoice-series"
                value={invoiceSeries}
                maxLength={5}
                onChange={(e) => setInvoiceSeries(e.target.value)}
                className="h-9"
              />
            </div>
            <div className="space-y-1.5 sm:col-span-4">
              <Label htmlFor="invoice-key">Chave de acesso da NF-e</Label>
              <Input
                id="invoice-key"
                value={invoiceKey}
                inputMode="numeric"
                maxLength={44}
                placeholder="44 dígitos (opcional)"
                onChange={(e) => setInvoiceKey(e.target.value.replace(/\D/g, ""))}
                aria-invalid={!!invoiceKey && invoiceKey.length !== 44}
                className="h-9 font-mono tracking-tight"
              />
            </div>
          </section>

          {/* Itens */}
          <section className="overflow-hidden rounded-xl border border-border">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-100 text-xs text-slate-700 dark:bg-muted dark:text-muted-foreground">
                  <tr>
                    <th className="px-3 py-2 text-left font-semibold">Produto</th>
                    <th className="px-3 py-2 text-right font-semibold">Pendente</th>
                    <th className="px-3 py-2 text-right font-semibold">Receber</th>
                    <th className="px-3 py-2 text-right font-semibold">Custo na nota</th>
                    <th className="px-3 py-2 text-right font-semibold">Custo final</th>
                    <th className="px-3 py-2 text-right font-semibold">Custo médio</th>
                    <th className="px-3 py-2 text-right font-semibold">Preço de venda</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map(({ item, line, landed, newCost, currentMargin, newMargin, suggestedPrice }) => {
                    const skipped = line.quantity === 0;
                    return (
                      <tr key={item.id} className={`border-t border-border align-top ${skipped ? "bg-slate-50 text-muted-foreground dark:bg-muted/30" : ""}`}>
                        <td className="px-3 py-2">
                          <p className="font-medium text-foreground">{item.product_name}</p>
                          <p className="text-xs text-muted-foreground">
                            {item.sell_in_bulk ? "Granel · só custo" : `Estoque ${item.stock_quantity}`}
                          </p>
                        </td>
                        <td className="px-3 py-2 text-right tabular-nums">{item.pending_quantity}</td>
                        <td className="px-3 py-2">
                          <Input
                            type="number"
                            min={0}
                            max={item.pending_quantity}
                            step={1}
                            inputMode="numeric"
                            value={line.quantity}
                            onChange={(e) =>
                              updateLine(item.id, { quantity: Math.max(0, Math.trunc(Number(e.target.value) || 0)) })
                            }
                            aria-label={`Quantidade recebida de ${item.product_name}`}
                            aria-invalid={line.quantity > item.pending_quantity}
                            className="ml-auto h-8 w-20 text-right"
                          />
                        </td>
                        <td className="px-3 py-2">
                          <Input
                            type="number"
                            min={0}
                            step="0.01"
                            inputMode="decimal"
                            value={line.unitCost}
                            onChange={(e) => updateLine(item.id, { unitCost: Math.max(0, Number(e.target.value) || 0) })}
                            aria-label={`Custo na nota de ${item.product_name}`}
                            className="ml-auto h-8 w-28 text-right"
                          />
                        </td>
                        <td className="px-3 py-2 text-right tabular-nums">{skipped ? "—" : unitMoney(landed)}</td>
                        <td className="px-3 py-2 text-right tabular-nums">
                          <p className="font-medium">{money(newCost)}</p>
                          {!skipped && newCost !== item.current_cost && (
                            <p className="text-xs text-muted-foreground">antes {money(item.current_cost)}</p>
                          )}
                        </td>
                        <td className="px-3 py-2">
                          <div className="flex items-center justify-end gap-1">
                            {suggestedPrice !== null && !skipped && suggestedPrice !== (line.salePrice ?? item.sale_price) && (
                              <button
                                type="button"
                                onClick={() => updateLine(item.id, { salePrice: suggestedPrice })}
                                title={`Aplicar ${money(suggestedPrice)} para manter a margem de ${percent(currentMargin)}`}
                                aria-label={`Manter margem de ${item.product_name}`}
                                className="grid h-8 w-8 shrink-0 cursor-pointer place-items-center rounded-lg text-blue-700 dark:text-blue-300 hover:bg-primary/10"
                              >
                                <Wand2 className="h-4 w-4" />
                              </button>
                            )}
                            <Input
                              type="number"
                              min={0}
                              step="0.01"
                              inputMode="decimal"
                              value={line.salePrice ?? item.sale_price}
                              onChange={(e) => updateLine(item.id, { salePrice: Math.max(0, Number(e.target.value) || 0) })}
                              aria-label={`Preço de venda de ${item.product_name}`}
                              className="h-8 w-28 text-right"
                            />
                          </div>
                          <p className={`mt-0.5 text-right text-xs ${newMargin < currentMargin - 0.05 ? "text-amber-700 dark:text-amber-400" : "text-muted-foreground"}`}>
                            margem {percent(currentMargin)} → {percent(newMargin)}
                          </p>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Valores da nota */}
            <section className="space-y-3">
              <h3 className="text-sm font-semibold text-foreground">Valores da nota</h3>
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="freight">Frete</Label>
                  {moneyInput(freight, setFreight, "freight")}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="other-expenses">Outras despesas</Label>
                  {moneyInput(otherExpenses, setOtherExpenses, "other-expenses")}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="discount">Desconto</Label>
                  {moneyInput(discount, setDiscount, "discount")}
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Frete e despesas somam e o desconto subtrai do custo dos produtos,
                rateados pelo valor de cada item.
              </p>
              <dl className="space-y-1 rounded-xl bg-slate-100 p-3 dark:bg-muted text-sm">
                <div className="flex justify-between"><dt className="text-muted-foreground">Produtos</dt><dd className="tabular-nums">{money(itemsTotal)}</dd></div>
                {freight > 0 && <div className="flex justify-between"><dt className="text-muted-foreground">+ Frete</dt><dd className="tabular-nums">{money(freight)}</dd></div>}
                {otherExpenses > 0 && <div className="flex justify-between"><dt className="text-muted-foreground">+ Outras despesas</dt><dd className="tabular-nums">{money(otherExpenses)}</dd></div>}
                {discount > 0 && <div className="flex justify-between"><dt className="text-muted-foreground">− Desconto</dt><dd className="tabular-nums">{money(discount)}</dd></div>}
                <div className="flex justify-between border-t border-border pt-1 text-base font-semibold">
                  <dt>Total da nota</dt>
                  <dd className="tabular-nums">{money(total)}</dd>
                </div>
              </dl>
              <div className="space-y-1.5">
                <Label htmlFor="receipt-notes">Observações</Label>
                <Textarea id="receipt-notes" value={notes} onChange={(e) => setNotes(e.target.value)} maxLength={1000} rows={2} />
              </div>
            </section>

            {/* Financeiro */}
            <section className="space-y-3">
              <h3 className="text-sm font-semibold text-foreground">Contas a pagar</h3>
              {total <= 0 ? (
                <p className="rounded-xl bg-slate-100 p-3 dark:bg-muted text-sm text-muted-foreground">
                  Recebimento sem valor: nenhuma conta será gerada.
                </p>
              ) : (
                <>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-1.5">
                      <Label htmlFor="installments-count">Parcelas</Label>
                      <Input
                        id="installments-count"
                        type="number"
                        min={1}
                        max={60}
                        value={installmentsCount}
                        onChange={(e) => {
                          setInstallmentsCount(Math.min(60, Math.max(1, Math.trunc(Number(e.target.value) || 1))));
                          setCustom(null);
                        }}
                        className="h-9"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="first-due">1º vencimento</Label>
                      <Input
                        id="first-due"
                        type="date"
                        value={firstDue}
                        onChange={(e) => {
                          setFirstDue(e.target.value);
                          setCustom(null);
                        }}
                        className="h-9"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Intervalo</Label>
                      <Select
                        value={intervalDays}
                        onValueChange={(v) => {
                          setIntervalDays(v);
                          setCustom(null);
                        }}
                        disabled={installmentsCount === 1}
                      >
                        <SelectTrigger className="h-9 w-full"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {INTERVALS.map((i) => (
                            <SelectItem key={i.value} value={i.value}>{i.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <ul className="max-h-48 space-y-1.5 overflow-y-auto">
                    {installments.map((inst, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <span className="w-10 shrink-0 text-xs text-muted-foreground tabular-nums">
                          {index + 1}/{installments.length}
                        </span>
                        <Input
                          type="date"
                          value={inst.due_date}
                          onChange={(e) => editInstallment(index, { due_date: e.target.value })}
                          aria-label={`Vencimento da parcela ${index + 1}`}
                          className="h-8"
                        />
                        <Input
                          type="number"
                          min={0}
                          step="0.01"
                          value={inst.amount}
                          onChange={(e) => editInstallment(index, { amount: round2(Number(e.target.value) || 0) })}
                          aria-label={`Valor da parcela ${index + 1}`}
                          className="h-8 w-32 text-right"
                        />
                      </li>
                    ))}
                  </ul>
                  {custom && (
                    <button
                      type="button"
                      onClick={() => setCustom(null)}
                      className="cursor-pointer text-xs font-medium text-blue-700 dark:text-blue-300 hover:underline"
                    >
                      Redistribuir parcelas igualmente
                    </button>
                  )}

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label>Categoria</Label>
                      <Select value={categoryId} onValueChange={setCategoryId}>
                        <SelectTrigger className="h-9 w-full"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value={NONE}>Sem categoria</SelectItem>
                          {billsCategories?.filter((c) => c.is_active).map((c) => (
                            <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label>Forma de pagamento</Label>
                      <Select value={paymentMethodId} onValueChange={setPaymentMethodId}>
                        <SelectTrigger className="h-9 w-full"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value={NONE}>Não informar</SelectItem>
                          {paymentMethods?.filter((m) => m.is_active).map((m) => (
                            <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {installments.length === 1
                      ? `Vencimento em ${formatDate(installments[0]?.due_date)}.`
                      : `${installments.length} parcelas de ${formatDate(installments[0]?.due_date)} a ${formatDate(installments[installments.length - 1]?.due_date)}.`}
                  </p>
                </>
              )}
            </section>
          </div>

          {errors.length > 0 && (
            <ul role="alert" className="space-y-1 rounded-xl border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200">
              {errors.map((e) => (
                <li key={e} className="flex items-start gap-2">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                  {e}
                </li>
              ))}
            </ul>
          )}
        </div>

        <DialogFooter className="items-center gap-3 sm:justify-between">
          <p className="text-sm text-muted-foreground">
            {receiving.length} {receiving.length === 1 ? "item" : "itens"} ·{" "}
            <span className="font-semibold text-foreground">{money(total)}</span>
          </p>
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={() => handleOpenChange(false)} disabled={submitting} className="cursor-pointer">
              Cancelar
            </Button>
            <Button type="button" onClick={submit} disabled={errors.length > 0 || submitting} className="cursor-pointer">
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <PackageCheck className="h-4 w-4" />}
              Confirmar recebimento
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
