"use client";

import { Fragment, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  ArrowLeft,
  ChevronDown,
  ChevronRight,
  Grid3x3,
  Loader2,
  PackageOpen,
  Save,
  Send,
  Trash2,
} from "lucide-react";
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
import { useVendors } from "@/hooks/useVendors";
import { usePurchaseOrderUpdated } from "@/hooks/usePurchases";
import {
  CatalogProduct,
  PurchaseOrderDetail,
  SavePurchaseOrderParams,
} from "@/interfaces/purchases.interface";
import {
  CreatePurchaseOrder,
  SendPurchaseOrder,
  UpdatePurchaseOrder,
} from "@/service/purchases.service";
import { getApiErrorMessage } from "@/utils/apiError";
import { ModelGridDialog } from "./ModelGridDialog";
import { NewProductDialog, PickedItem } from "./NewProductDialog";
import { ProductPicker } from "./ProductPicker";
import { VendorEmailOption, emailOrderWithFeedback } from "./SendOrderDialog";
import { money, round2, unitMoney } from "./format";

interface FormItem {
  product_id: string;
  product_name: string;
  /** Preenchidos nos produtos de grade: agrupam as variações na tabela */
  model_name: string;
  color: string;
  size: string;
  sell_in_bulk: boolean;
  stock_quantity: number;
  current_cost: number;
  quantity: number;
  unit_cost: number;
}

interface OrderFormProps {
  /** Sem pedido: criação. Com pedido: edição (rascunho/enviado sem recebimentos) */
  order?: PurchaseOrderDetail;
}

export function OrderForm({ order }: OrderFormProps) {
  const router = useRouter();
  const onUpdated = usePurchaseOrderUpdated();
  const { vendorsIsActive, loading: loadingVendors } = useVendors();

  const [vendorId, setVendorId] = useState(order?.vendor_id ?? "");
  const [expectedDate, setExpectedDate] = useState(order?.expected_date ?? "");
  const [notes, setNotes] = useState(order?.notes ?? "");
  const [items, setItems] = useState<FormItem[]>(
    () =>
      order?.items.map((it) => ({
        product_id: it.product_id,
        product_name: it.product_name,
        model_name: it.model_name,
        color: it.color,
        size: it.size,
        sell_in_bulk: it.sell_in_bulk,
        stock_quantity: it.stock_quantity,
        current_cost: it.current_cost,
        quantity: it.quantity,
        unit_cost: it.unit_cost,
      })) ?? [],
  );
  const [saving, setSaving] = useState<"draft" | "send" | null>(null);
  // Cadastro rápido (nome digitado na busca) e grade de recompra abertos
  const [newProductName, setNewProductName] = useState<string | null>(null);
  const [gridModel, setGridModel] = useState<string | null>(null);
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  // E-mail ao fornecedor: ao enviar (criação/rascunho) ou ao alterar pedido já enviado
  const [emailOnSend, setEmailOnSend] = useState(true);
  const [emailOnUpdate, setEmailOnUpdate] = useState(true);

  // Fornecedor inativo do pedido em edição continua aparecendo no select
  const vendors = [...(vendorsIsActive ?? [])];
  if (order && !vendors.some((v) => v.id === order.vendor_id)) {
    vendors.unshift({ id: order.vendor_id, name: `${order.vendor_name} (inativo)` } as (typeof vendors)[number]);
  }

  const vendorEmail =
    vendors.find((v) => v.id === vendorId)?.email?.trim() ||
    (order && order.vendor_id === vendorId ? order.vendor_email : "") ||
    "";
  // Pedido já enviado ao fornecedor: a alteração pode ser avisada por e-mail
  const alreadySent = order?.status === "sent";

  const total = round2(items.reduce((sum, it) => sum + it.quantity * it.unit_cost, 0));
  const invalidItem = items.find((it) => !(it.quantity > 0) || it.unit_cost < 0);
  const canSave = !!vendorId && items.length > 0 && !invalidItem && !saving;

  const toFormItem = (product: CatalogProduct, quantity: number, unitCost: number): FormItem => ({
    product_id: product.id,
    product_name: product.name,
    model_name: product.model_name,
    color: product.color,
    size: product.size,
    sell_in_bulk: product.sell_in_bulk,
    stock_quantity: product.quantity,
    current_cost: product.cost_price,
    quantity,
    unit_cost: unitCost,
  });

  const addProduct = (product: CatalogProduct) => {
    setItems((current) => [...current, toFormItem(product, 1, product.cost_price)]);
  };

  // Grade (cadastro novo ou recompra): atualiza as que já estão no pedido,
  // adiciona as novas e remove as que ficaram com quantidade zero
  const applyPicked = (picked: PickedItem[]) => {
    setItems((current) => {
      const next = [...current];
      for (const { product, quantity, unitCost } of picked) {
        const index = next.findIndex((it) => it.product_id === product.id);
        if (quantity <= 0) {
          if (index >= 0) next.splice(index, 1);
        } else if (index >= 0) {
          next[index] = { ...next[index], quantity };
        } else {
          next.push(toFormItem(product, quantity, unitCost));
        }
      }
      return next;
    });
  };

  const updateItem = (productId: string, patch: Partial<FormItem>) => {
    setItems((current) =>
      current.map((it) => (it.product_id === productId ? { ...it, ...patch } : it)),
    );
  };

  const removeItems = (productIds: string[]) => {
    setItems((current) => current.filter((it) => !productIds.includes(it.product_id)));
  };

  // Variações do mesmo modelo ficam juntas, na ordem em que entraram no pedido
  const groups: { key: string; model: string; items: FormItem[] }[] = [];
  for (const it of items) {
    const key = it.model_name ? `m:${it.model_name.toLowerCase()}` : `p:${it.product_id}`;
    const group = groups.find((g) => g.key === key);
    if (group) group.items.push(it);
    else groups.push({ key, model: it.model_name, items: [it] });
  }

  const save = async (send: boolean) => {
    if (!canSave) return;
    setSaving(send ? "send" : "draft");

    const params: SavePurchaseOrderParams = {
      vendor_id: vendorId,
      expected_date: expectedDate || undefined,
      notes: notes.trim() || undefined,
      items: items.map((it) => ({
        product_id: it.product_id,
        quantity: it.quantity,
        unit_cost: it.unit_cost,
      })),
      send,
    };

    try {
      let saved = order
        ? await UpdatePurchaseOrder(order.id, params)
        : await CreatePurchaseOrder(params);
      // Na edição o envio é uma ação separada: o PUT só salva os dados
      if (order && send && saved.can_send) {
        saved = await SendPurchaseOrder(saved.id);
      }
      onUpdated(saved);
      toast.success(
        order
          ? "Pedido atualizado!"
          : `Pedido nº ${saved.number} criado${send ? " e enviado" : ""}!`,
      );

      const emailKind = send && emailOnSend ? "sent" : alreadySent && emailOnUpdate ? "updated" : null;
      if (emailKind && vendorEmail) {
        const emailed = await emailOrderWithFeedback(saved.id, emailKind, vendorEmail);
        if (emailed) onUpdated(emailed);
      }
      router.push(`/purchases/${saved.id}`);
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Não foi possível salvar o pedido."));
      setSaving(null);
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="dash-in flex flex-wrap items-start justify-between gap-4">
        <div>
          <Link
            href={order ? `/purchases/${order.id}` : "/purchases"}
            className="mb-2 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            {order ? `Pedido nº ${order.number}` : "Compras"}
          </Link>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            {order ? `Editar pedido nº ${order.number}` : "Novo pedido de compra"}
          </h1>
          <p className="mt-1 text-muted-foreground">
            O estoque e o financeiro só mudam quando a mercadoria for recebida.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="min-w-0 space-y-6">
          <section className="dash-in grid gap-4 rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-soft)] sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2 lg:col-span-1">
              <Label>
                Fornecedor <span className="text-destructive">*</span>
              </Label>
              <Select value={vendorId} onValueChange={setVendorId}>
                <SelectTrigger className="h-10 w-full">
                  <SelectValue
                    placeholder={loadingVendors ? "Carregando..." : "Selecione o fornecedor"}
                  />
                </SelectTrigger>
                <SelectContent>
                  {vendors.map((vendor) => (
                    <SelectItem key={vendor.id} value={vendor.id}>
                      {vendor.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {!loadingVendors && vendors.length === 0 && (
                <p className="text-xs text-muted-foreground">
                  Nenhum fornecedor ativo.{" "}
                  <Link href="/config/vendors" className="font-medium text-blue-700 dark:text-blue-300 hover:underline">
                    Cadastrar fornecedor
                  </Link>
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="expected-date">Previsão de entrega</Label>
              <Input
                id="expected-date"
                type="date"
                value={expectedDate}
                onChange={(e) => setExpectedDate(e.target.value)}
                className="h-10"
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="order-notes">Observações</Label>
              <Textarea
                id="order-notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                maxLength={1000}
                rows={2}
                placeholder="Condições combinadas, prazo, contato do vendedor..."
              />
            </div>
          </section>

          <section className="dash-in overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-soft)]">
            <header className="flex flex-wrap items-center justify-between gap-3 border-b border-border p-4">
              <h2 className="font-semibold text-foreground">
                Itens{" "}
                <span className="text-sm font-normal text-muted-foreground">
                  ({items.length} {items.length === 1 ? "produto" : "produtos"})
                </span>
              </h2>
              <ProductPicker
                selectedIds={items.map((it) => it.product_id)}
                onSelect={addProduct}
                onSelectModel={setGridModel}
                onCreateNew={setNewProductName}
              />
            </header>

            {items.length === 0 ? (
              <div className="flex flex-col items-center gap-2 px-6 py-14 text-center">
                <PackageOpen className="h-8 w-8 text-muted-foreground" />
                <p className="font-medium text-foreground">Nenhum produto no pedido</p>
                <p className="text-sm text-muted-foreground">
                  Use &quot;Adicionar produto&quot; para montar o pedido.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-100 text-xs text-slate-700 dark:bg-muted dark:text-muted-foreground">
                    <tr>
                      <th className="px-4 py-2.5 text-left font-semibold">Produto</th>
                      <th className="px-3 py-2.5 text-right font-semibold">Estoque</th>
                      <th className="px-3 py-2.5 text-right font-semibold">Quantidade</th>
                      <th className="px-3 py-2.5 text-right font-semibold">Custo unitário</th>
                      <th className="px-3 py-2.5 text-right font-semibold">Total</th>
                      <th className="w-12 px-3 py-2.5" />
                    </tr>
                  </thead>
                  <tbody>
                    {groups.map((group) => {
                      if (group.items.length === 1) {
                        const it = group.items[0];
                        return <ItemRow key={it.product_id} item={it} label={it.product_name} onChange={updateItem} onRemove={removeItems} />;
                      }
                      const isCollapsed = collapsed[group.key];
                      const qty = group.items.reduce((s, it) => s + (it.quantity || 0), 0);
                      const value = round2(group.items.reduce((s, it) => s + it.quantity * it.unit_cost, 0));
                      return (
                        <Fragment key={group.key}>
                          <tr className="border-t border-border bg-slate-50 dark:bg-muted/40">
                            <td className="px-4 py-2.5" colSpan={2}>
                              <button
                                type="button"
                                onClick={() => setCollapsed((c) => ({ ...c, [group.key]: !c[group.key] }))}
                                aria-expanded={!isCollapsed}
                                className="flex cursor-pointer items-center gap-1.5 text-left font-semibold text-foreground"
                              >
                                {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                                {group.model}
                                <span className="font-normal text-muted-foreground">
                                  ({group.items.length} variações)
                                </span>
                              </button>
                            </td>
                            <td className="px-3 py-2.5 text-right font-semibold tabular-nums">{qty}</td>
                            <td className="px-3 py-2.5 text-right">
                              <button
                                type="button"
                                onClick={() => setGridModel(group.model)}
                                className="inline-flex cursor-pointer items-center gap-1 text-xs font-medium text-blue-700 dark:text-blue-300 hover:underline"
                              >
                                <Grid3x3 className="h-3.5 w-3.5" />
                                Editar grade
                              </button>
                            </td>
                            <td className="px-3 py-2.5 text-right font-semibold tabular-nums">{money(value)}</td>
                            <td className="px-3 py-2.5 text-right">
                              <button
                                type="button"
                                onClick={() => removeItems(group.items.map((it) => it.product_id))}
                                aria-label={`Remover todas as variações de ${group.model}`}
                                className="grid h-8 w-8 cursor-pointer place-items-center rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </td>
                          </tr>
                          {!isCollapsed &&
                            group.items.map((it) => (
                              <ItemRow
                                key={it.product_id}
                                item={it}
                                indent
                                label={[it.color, it.size].filter(Boolean).join(" – ") || it.product_name}
                                onChange={updateItem}
                                onRemove={removeItems}
                              />
                            ))}
                        </Fragment>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>

        <aside className="dash-in h-fit space-y-4 rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-soft)] xl:sticky xl:top-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Total do pedido
            </p>
            <p className="mt-1 text-3xl font-bold tabular-nums text-foreground">
              {money(total)}
            </p>
            <p className="text-sm text-muted-foreground">
              {items.length} {items.length === 1 ? "produto" : "produtos"} ·{" "}
              {items.reduce((sum, it) => sum + (it.quantity || 0), 0)} unidades
            </p>
          </div>

          {invalidItem && (
            <p className="text-xs font-medium text-destructive">
              Informe uma quantidade maior que zero em todos os itens.
            </p>
          )}

          {vendorId && (!order || order.can_send) && (
            <VendorEmailOption
              id="order-email-on-send"
              vendorEmail={vendorEmail}
              checked={emailOnSend}
              onCheckedChange={setEmailOnSend}
              label="Ao enviar, mandar o pedido por e-mail"
            />
          )}
          {vendorId && alreadySent && (
            <VendorEmailOption
              id="order-email-on-update"
              vendorEmail={vendorEmail}
              checked={emailOnUpdate}
              onCheckedChange={setEmailOnUpdate}
              label="Avisar o fornecedor da alteração por e-mail"
            />
          )}

          <div className="space-y-2">
            {(!order || order.can_send) && (
              <Button
                type="button"
                onClick={() => save(true)}
                disabled={!canSave}
                className="h-10 w-full cursor-pointer"
              >
                {saving === "send" ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
                {order ? "Salvar e enviar" : "Criar e enviar ao fornecedor"}
              </Button>
            )}
            <Button
              type="button"
              variant="outline"
              onClick={() => save(false)}
              disabled={!canSave}
              className="h-10 w-full cursor-pointer"
            >
              {saving === "draft" ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              {order ? "Salvar alterações" : "Salvar como rascunho"}
            </Button>
          </div>
        </aside>
      </div>

      {newProductName !== null && (
        <NewProductDialog
          open
          initialName={newProductName}
          onOpenChange={(open) => !open && setNewProductName(null)}
          onCreated={applyPicked}
        />
      )}

      <ModelGridDialog
        modelName={gridModel}
        currentQuantities={Object.fromEntries(items.map((it) => [it.product_id, it.quantity]))}
        onOpenChange={(open) => !open && setGridModel(null)}
        onApply={applyPicked}
      />
    </div>
  );
}

interface ItemRowProps {
  item: FormItem;
  label: string;
  /** Variação dentro do grupo do modelo */
  indent?: boolean;
  onChange: (productId: string, patch: Partial<FormItem>) => void;
  onRemove: (productIds: string[]) => void;
}

function ItemRow({ item: it, label, indent = false, onChange, onRemove }: ItemRowProps) {
  return (
    <tr className="border-t border-border">
      <td className={`py-2.5 pr-3 ${indent ? "pl-10" : "pl-4"}`}>
        <p className="font-medium text-foreground">{label}</p>
        <p className="text-xs text-muted-foreground">Custo atual {unitMoney(it.current_cost)}</p>
      </td>
      <td className="px-3 py-2.5 text-right tabular-nums text-muted-foreground">
        {it.sell_in_bulk ? "Granel" : it.stock_quantity}
      </td>
      <td className="px-3 py-2.5 text-right">
        <Input
          type="number"
          min={1}
          step={1}
          inputMode="numeric"
          value={it.quantity || ""}
          onChange={(e) =>
            onChange(it.product_id, { quantity: Math.max(0, Math.trunc(Number(e.target.value) || 0)) })
          }
          aria-label={`Quantidade de ${it.product_name}`}
          aria-invalid={!(it.quantity > 0)}
          className="ml-auto h-9 w-24 text-right"
        />
      </td>
      <td className="px-3 py-2.5 text-right">
        <Input
          type="number"
          min={0}
          step="0.01"
          inputMode="decimal"
          value={Number.isNaN(it.unit_cost) ? "" : it.unit_cost}
          onChange={(e) => onChange(it.product_id, { unit_cost: Math.max(0, Number(e.target.value) || 0) })}
          aria-label={`Custo unitário de ${it.product_name}`}
          className="ml-auto h-9 w-32 text-right"
        />
      </td>
      <td className="px-3 py-2.5 text-right font-medium tabular-nums">
        {money(round2(it.quantity * it.unit_cost))}
      </td>
      <td className="px-3 py-2.5 text-right">
        <button
          type="button"
          onClick={() => onRemove([it.product_id])}
          aria-label={`Remover ${it.product_name}`}
          className="grid h-8 w-8 cursor-pointer place-items-center rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </td>
    </tr>
  );
}
