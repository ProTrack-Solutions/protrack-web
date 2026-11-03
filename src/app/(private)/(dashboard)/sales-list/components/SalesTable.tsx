"use client";

import { Fragment, useEffect, useState } from "react";
import Link from "next/link";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  AlertCircle,
  ArrowLeftRight,
  ChevronDown,
  ChevronRight,
  Loader2,
  Pencil,
  Printer,
  Receipt,
  Search,
  Trash2,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton, brl } from "@/components/DashCard";
import { DataPagination } from "@/components/DataPagination";
import { DialogAlterSale } from "@/components/DialogAlterSale";
import { DialogConfirm } from "@/components/DialogConfirm";
import { useSales } from "@/hooks/useSales";
import { PaymentMethod } from "@/enum/methodPayments";
import {
  ListSalesWithInstallmentsResponse,
  SalePaginationParams,
} from "@/interfaces/sale.interface";
import { DeleteSale, GetSaleReceipt } from "@/service/sale.service";
import { getApiErrorMessage } from "@/utils/apiError";
import { getPageRange } from "@/utils/pagination";
import { getPaymentMethodLabel } from "@/utils/paymentMethodFormat";
import { getSaleStatusLabel, getSaleStatusVariant } from "@/utils/salesStatus";
import { SalesRange, formatDateTime, plural } from "./format";

const PER_PAGE = 10;

type StatusFilter = NonNullable<SalePaginationParams["saleStatus"]> | "all";

const STATUS_FILTERS: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "Todas" },
  { value: "paid", label: "Pagas" },
  { value: "pending", label: "Pendentes" },
  { value: "partial", label: "Parciais" },
  { value: "overdue", label: "Atrasadas" },
  { value: "canceled", label: "Canceladas" },
];

function useDebouncedValue<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

/** "2× Camiseta, Calça +2" */
function productsSummary(sale: ListSalesWithInstallmentsResponse) {
  const items = sale.products ?? [];
  const shown = items
    .slice(0, 2)
    .map((p) => (p.quantity > 1 ? `${p.quantity}× ${p.product_name}` : p.product_name))
    .join(", ");
  return items.length > 2 ? `${shown} +${items.length - 2}` : shown;
}

const shortDate = (date: string) => {
  const [y, m, d] = date.slice(0, 10).split("-");
  return `${d}/${m}/${y}`;
};

interface SalesTableProps {
  range: SalesRange;
}

export function SalesTable({ range }: SalesTableProps) {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [paymentMethod, setPaymentMethod] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [saleToEdit, setSaleToEdit] = useState<ListSalesWithInstallmentsResponse>();
  const [saleToDelete, setSaleToDelete] = useState<string | null>(null);
  const [printingSaleId, setPrintingSaleId] = useState<string | null>(null);
  const debouncedSearch = useDebouncedValue(search.trim(), 300);

  // Trocar o período no cabeçalho volta para a primeira página
  const rangeKey = `${range.start_date ?? ""}|${range.end_date ?? ""}`;
  const [lastRangeKey, setLastRangeKey] = useState(rangeKey);
  if (lastRangeKey !== rangeKey) {
    setLastRangeKey(rangeKey);
    setPage(1);
  }

  const { data, isLoading, isError, error, isPlaceholderData, refetch } =
    useSales({
      Page: page,
      PerPage: PER_PAGE,
      Search: debouncedSearch,
      sortBy: "sale_at",
      OrderBy: "desc",
      saleStatus: status === "all" ? undefined : status,
      paymentMethod:
        paymentMethod === "all"
          ? undefined
          : (paymentMethod as SalePaginationParams["paymentMethod"]),
      saleStartDate: range.start_date,
      saleEndDate: range.end_date,
    });

  const sales = data?.data ?? [];
  const totalPages = Math.max(data?.total_pages ?? 1, 1);
  const filtered = !!debouncedSearch || status !== "all" || paymentMethod !== "all";

  const handlePrintSale = async (saleId: string) => {
    setPrintingSaleId(saleId);
    try {
      const blob = await GetSaleReceipt(saleId);
      const url = window.URL.createObjectURL(blob);

      // Carrega o PDF num iframe invisível e abre a janela de impressão do navegador
      const iframe = document.createElement("iframe");
      iframe.style.display = "none";
      iframe.src = url;
      iframe.onload = () => {
        iframe.contentWindow?.focus();
        iframe.contentWindow?.print();
        // Limpeza depois que a janela de impressão já leu o arquivo
        setTimeout(() => {
          iframe.remove();
          window.URL.revokeObjectURL(url);
        }, 60_000);
      };
      document.body.appendChild(iframe);
    } catch (error) {
      console.log(error);
      toast.error(getApiErrorMessage(error, "Erro ao gerar recibo da venda"));
    } finally {
      setPrintingSaleId(null);
    }
  };

  const handleDeleteSale = async (saleId: string) => {
    try {
      await DeleteSale(saleId);
      toast.success("Venda cancelada com sucesso");
      await queryClient.invalidateQueries({ queryKey: ["sales"] });
    } catch (error) {
      console.log(error);
      toast.error(getApiErrorMessage(error, "Erro ao cancelar venda"));
    }
  };

  return (
    <section
      className="dash-in overflow-hidden rounded-2xl border border-border/70 bg-card shadow-[var(--shadow-soft)]"
      style={{ animationDelay: "240ms" }}
    >
      <div className="space-y-3 border-b border-border p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary/10 text-primary">
              <Receipt className="h-4 w-4" />
            </span>
            Vendas do período
            {data && (
              <span className="font-normal text-muted-foreground">
                · {plural(data.total_rows, "venda", "vendas")}
              </span>
            )}
          </h2>
          <div className="flex w-full flex-wrap gap-2 sm:w-auto">
            <div className="relative flex-1 sm:w-72 sm:flex-none">
              <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder="Cliente, produto ou código"
                aria-label="Buscar vendas"
                className="h-9 pl-9"
              />
            </div>
            <Select
              value={paymentMethod}
              onValueChange={(v) => {
                setPaymentMethod(v);
                setPage(1);
              }}
            >
              <SelectTrigger className="h-9 w-full sm:w-48" aria-label="Forma de pagamento">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as formas</SelectItem>
                {Object.values(PaymentMethod).map((method) => (
                  <SelectItem key={method} value={method}>
                    {getPaymentMethodLabel(method)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div role="radiogroup" aria-label="Status" className="flex flex-wrap gap-1.5">
          {STATUS_FILTERS.map((option) => {
            const active = option.value === status;
            return (
              <button
                key={option.value}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => {
                  setStatus(option.value);
                  setPage(1);
                }}
                className={`cursor-pointer rounded-full border px-3 py-1 text-xs font-semibold transition-colors ${
                  active
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </div>

      {isError && !data ? (
        <div className="flex flex-col items-center gap-3 p-10 text-center">
          <AlertCircle className="h-8 w-8 text-destructive" />
          <p className="font-medium">
            {getApiErrorMessage(error, "Não foi possível carregar as vendas.")}
          </p>
          <Button onClick={() => refetch()} className="cursor-pointer">
            Tentar novamente
          </Button>
        </div>
      ) : isLoading ? (
        <div className="space-y-2 p-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      ) : sales.length === 0 ? (
        <div className="flex flex-col items-center gap-2 px-6 py-16 text-center">
          <Receipt className="h-8 w-8 text-muted-foreground" />
          <p className="font-medium text-foreground">
            {filtered ? "Nada encontrado com esses filtros." : "Nenhuma venda no período."}
          </p>
          {!filtered && (
            <Button asChild className="mt-2">
              <Link href="/sale">Registrar uma venda</Link>
            </Button>
          )}
        </div>
      ) : (
        <div
          className={`overflow-x-auto transition-opacity ${isPlaceholderData ? "opacity-60" : ""}`}
        >
          <table className="w-full text-sm">
            <thead className="bg-slate-100 text-xs text-slate-700 dark:bg-muted dark:text-muted-foreground">
              <tr>
                <th className="w-10 px-3 py-2.5" />
                <th className="px-3 py-2.5 text-left font-semibold">Venda</th>
                <th className="px-3 py-2.5 text-left font-semibold">Itens</th>
                <th className="px-3 py-2.5 text-left font-semibold">Pagamento</th>
                <th className="px-3 py-2.5 text-right font-semibold">Total</th>
                <th className="px-3 py-2.5 text-left font-semibold">Status</th>
                <th className="px-4 py-2.5 text-right font-semibold">Ações</th>
              </tr>
            </thead>
            <tbody>
              {sales.map((venda) => {
                const sale = venda.sale;
                const isExpanded = expandedId === sale.sale_id;
                const isCanceled = sale.sale_status === "canceled";
                const hasReturns = (sale.returned_total ?? 0) > 0;
                const installments = venda.installment ?? [];
                // Venda com devolução ou gerada por troca não pode ser editada nem cancelada
                const locked = hasReturns || sale.is_exchange_sale;
                const lockedTitle = sale.is_exchange_sale
                  ? "Venda gerada por uma troca"
                  : "A venda tem trocas ou devoluções";

                return (
                  <Fragment key={sale.sale_id}>
                    <tr
                      onClick={() => setExpandedId(isExpanded ? null : sale.sale_id)}
                      aria-expanded={isExpanded}
                      className={`cursor-pointer border-t border-border transition-colors hover:bg-slate-50 dark:hover:bg-muted/50 ${
                        isCanceled ? "opacity-60" : ""
                      }`}
                    >
                      <td className="px-3 py-3 text-muted-foreground">
                        {isExpanded ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </td>
                      <td className="px-3 py-3">
                        <p className="font-medium text-foreground">
                          {sale.customer_name || "Consumidor final"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          <span className="font-mono">{sale.sale_id.slice(0, 8)}</span>
                          {" · "}
                          {formatDateTime(sale.sale_at)}
                        </p>
                      </td>
                      <td className="max-w-56 px-3 py-3">
                        <p className="truncate text-muted-foreground">
                          {productsSummary(venda) || "—"}
                        </p>
                      </td>
                      <td className="px-3 py-3">
                        <p>{getPaymentMethodLabel(sale.payment_method)}</p>
                        {sale.installments_count > 0 && (
                          <p className="text-xs text-muted-foreground">
                            {sale.installments_count}x
                            {sale.down_payments > 0 && ` · entrada ${brl(sale.down_payments)}`}
                          </p>
                        )}
                      </td>
                      <td className="px-3 py-3 text-right">
                        <p className="font-semibold tabular-nums">{brl(sale.total_amount)}</p>
                        {sale.discount_amount > 0 && (
                          <p className="text-xs tabular-nums text-destructive">
                            − {brl(sale.discount_amount)} desc.
                          </p>
                        )}
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex flex-wrap items-center gap-1">
                          <Badge variant={getSaleStatusVariant(sale.sale_status)}>
                            {getSaleStatusLabel(sale.sale_status)}
                          </Badge>
                          {hasReturns && (
                            <span
                              className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-900 ring-1 ring-inset ring-amber-300 dark:bg-amber-500/15 dark:text-amber-300 dark:ring-amber-500/30"
                              title={`${brl(sale.returned_total)} devolvidos`}
                            >
                              {sale.returned_total >= sale.total_amount - 0.005
                                ? "Devolvida"
                                : "Devolução parcial"}
                            </span>
                          )}
                          {sale.is_exchange_sale && (
                            <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-800 ring-1 ring-inset ring-blue-200 dark:bg-blue-500/15 dark:text-blue-300 dark:ring-blue-500/30">
                              Troca
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="cursor-pointer"
                            title="Imprimir recibo"
                            disabled={printingSaleId === sale.sale_id}
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePrintSale(sale.sale_id);
                            }}
                          >
                            {printingSaleId === sale.sale_id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Printer className="h-4 w-4" />
                            )}
                          </Button>
                          {!isCanceled && (
                            <>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="cursor-pointer"
                                title="Trocar ou devolver itens"
                                asChild
                              >
                                <Link
                                  href={`/returns/new?sale=${sale.sale_id}`}
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <ArrowLeftRight className="h-4 w-4" />
                                </Link>
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="cursor-pointer"
                                title={locked ? lockedTitle : "Editar venda"}
                                disabled={locked}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSaleToEdit(venda);
                                }}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="cursor-pointer text-destructive hover:text-destructive"
                                title={locked ? lockedTitle : "Cancelar venda"}
                                disabled={locked}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSaleToDelete(sale.sale_id);
                                }}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>

                    {isExpanded && (
                      <tr className="border-t border-border bg-muted/30">
                        <td colSpan={7} className="px-6 py-4">
                          <div className="grid gap-4 lg:grid-cols-2">
                            <div>
                              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                Itens
                              </p>
                              <ul className="divide-y divide-border/60 rounded-xl border border-border bg-card">
                                {(venda.products ?? []).map((p) => (
                                  <li
                                    key={p.sale_item_id}
                                    className="flex items-center justify-between gap-3 px-3 py-2"
                                  >
                                    <span className="min-w-0">
                                      <span className="block truncate font-medium">
                                        {p.product_name}
                                      </span>
                                      <span className="text-xs text-muted-foreground">
                                        {p.quantity} × {brl(p.unit_price)}
                                        {p.item_discount > 0 && ` · − ${brl(p.item_discount)}`}
                                      </span>
                                    </span>
                                    <span className="shrink-0 font-semibold tabular-nums">
                                      {brl(p.quantity * p.unit_price - p.item_discount)}
                                    </span>
                                  </li>
                                ))}
                              </ul>
                              <dl className="mt-2 space-y-0.5 px-1 text-xs text-muted-foreground">
                                <div className="flex justify-between">
                                  <dt>Subtotal</dt>
                                  <dd className="tabular-nums">{brl(sale.subtotal)}</dd>
                                </div>
                                {sale.discount_amount > 0 && (
                                  <div className="flex justify-between">
                                    <dt>Desconto</dt>
                                    <dd className="tabular-nums text-destructive">
                                      − {brl(sale.discount_amount)}
                                    </dd>
                                  </div>
                                )}
                                {sale.credit_amount > 0 && (
                                  <div className="flex justify-between">
                                    <dt>Pago com vale-troca</dt>
                                    <dd className="tabular-nums">{brl(sale.credit_amount)}</dd>
                                  </div>
                                )}
                                {hasReturns && (
                                  <div className="flex justify-between">
                                    <dt>Devolvido</dt>
                                    <dd className="tabular-nums text-amber-700 dark:text-amber-300">
                                      {brl(sale.returned_total)}
                                    </dd>
                                  </div>
                                )}
                              </dl>
                            </div>

                            {installments.length > 0 && (
                              <div>
                                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                  Parcelas ({installments.length}x)
                                </p>
                                <ul className="divide-y divide-border/60 rounded-xl border border-border bg-card">
                                  {installments.map((p) => (
                                    <li
                                      key={p.installment_id ?? p.installment_number}
                                      className="flex items-center justify-between gap-3 px-3 py-2"
                                    >
                                      <span>
                                        <span className="font-medium">{p.installment_number}ª</span>
                                        <span className="ml-2 text-xs text-muted-foreground">
                                          vence {shortDate(p.due_date)}
                                        </span>
                                      </span>
                                      <span className="flex items-center gap-2">
                                        <span className="font-semibold tabular-nums">
                                          {brl(p.installment_balance)}
                                        </span>
                                        <Badge variant={getSaleStatusVariant(p.installment_status)}>
                                          {getSaleStatusLabel(p.installment_status)}
                                        </Badge>
                                      </span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {totalPages > 1 && (
        <div className="border-t border-border p-3">
          <DataPagination
            currentPage={page}
            totalPages={totalPages}
            pageRange={getPageRange(page, totalPages)}
            goToPage={setPage}
          />
        </div>
      )}

      {saleToDelete && (
        <DialogConfirm
          id={saleToDelete}
          open={!!saleToDelete}
          onOpenChange={(isOpen) => {
            if (!isOpen) setSaleToDelete(null);
          }}
          title="Cancelar venda?"
          description="Esta ação não pode ser desfeita. O estoque dos produtos será devolvido e as parcelas em aberto serão canceladas, abatendo o saldo devedor do cliente."
          onDelete={handleDeleteSale}
        />
      )}

      {saleToEdit && (
        <DialogAlterSale
          key={saleToEdit.sale.sale_id}
          setOpen={(isOpen) => {
            if (!isOpen) setSaleToEdit(undefined);
          }}
          open={!!saleToEdit}
          sale={saleToEdit}
        />
      )}
    </section>
  );
}
