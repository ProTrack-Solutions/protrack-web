"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  CalendarClock,
  PackageCheck,
  Plus,
  Search,
  Truck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Kpi, Skeleton } from "@/components/DashCard";
import { DataPagination } from "@/components/DataPagination";
import { usePurchaseOrders } from "@/hooks/usePurchases";
import { PurchaseOrderStatus } from "@/interfaces/purchases.interface";
import { getApiErrorMessage } from "@/utils/apiError";
import { getPageRange } from "@/utils/pagination";
import { OrderStatusBadge } from "./components/OrderStatusBadge";
import { STATUS_FILTERS, formatDate, money } from "./components/format";

const PER_PAGE = 20;

function useDebouncedValue<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

export default function PurchasesPage() {
  const router = useRouter();
  const [status, setStatus] = useState<PurchaseOrderStatus | "all">("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebouncedValue(search.trim(), 300);

  const { data, isLoading, isError, error, isPlaceholderData, refetch } =
    usePurchaseOrders({
      status: status === "all" ? undefined : status,
      search: debouncedSearch || undefined,
      page,
      per_page: PER_PAGE,
    });

  const overview = data?.overview;
  const counts = overview?.count_by_status ?? {};
  const totalCount = Object.values(counts).reduce((s, n) => s + (n ?? 0), 0);
  const awaiting = (counts.sent ?? 0) + (counts.partial ?? 0);

  return (
    <div className="space-y-6 p-6">
      <div className="dash-in flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Compras
          </h1>
          <p className="mt-1 text-muted-foreground">
            Pedidos aos fornecedores e entrada de mercadoria no estoque.
          </p>
        </div>
        <Button asChild className="h-10">
          <Link href="/purchases/new">
            <Plus className="h-4 w-4" />
            Novo pedido
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Kpi
          tone="primary"
          label="A receber"
          icon={<Truck className="h-4 w-4" />}
          loading={isLoading}
          value={overview?.pending_total ?? 0}
          footer={`${awaiting} ${awaiting === 1 ? "pedido aguardando" : "pedidos aguardando"} mercadoria`}
          delay={0}
        />
        <Kpi
          tone="plain"
          label="Recebido no mês"
          icon={<PackageCheck className="h-4 w-4" />}
          loading={isLoading}
          value={overview?.received_this_month ?? 0}
          footer="Entradas de mercadoria lançadas"
          delay={60}
        />
        <Kpi
          tone="plain"
          label="Atrasados"
          icon={<CalendarClock className="h-4 w-4" />}
          loading={isLoading}
          value={overview?.late_orders ?? 0}
          format={(v) => Math.round(v).toLocaleString("pt-BR")}
          accent={(overview?.late_orders ?? 0) > 0 ? "text-red-700 dark:text-red-400" : "text-foreground"}
          footer="Previsão de entrega já passou"
          delay={120}
        />
      </div>

      <section className="dash-in overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-soft)]">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border p-4">
          <div role="radiogroup" aria-label="Status" className="flex flex-wrap gap-1.5">
            {STATUS_FILTERS.map((option) => {
              const active = option.value === status;
              const count = option.value === "all" ? totalCount : counts[option.value];
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
                  {!!count && <span className="ml-1.5 opacity-90 tabular-nums">{count}</span>}
                </button>
              );
            })}
          </div>
          <div className="relative w-full sm:w-72">
            <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Fornecedor ou nº do pedido"
              aria-label="Buscar pedidos"
              className="h-9 pl-9"
            />
          </div>
        </div>

        {isError && !data ? (
          <div className="flex flex-col items-center gap-3 p-10 text-center">
            <AlertCircle className="h-8 w-8 text-destructive" />
            <p className="font-medium">{getApiErrorMessage(error, "Não foi possível carregar as compras.")}</p>
            <Button onClick={() => refetch()} className="cursor-pointer">Tentar novamente</Button>
          </div>
        ) : isLoading ? (
          <div className="space-y-2 p-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : data && data.data.length === 0 ? (
          <div className="flex flex-col items-center gap-2 px-6 py-16 text-center">
            <Truck className="h-8 w-8 text-muted-foreground" />
            <p className="font-medium text-foreground">
              {debouncedSearch || status !== "all" ? "Nenhum pedido encontrado." : "Nenhum pedido de compra ainda."}
            </p>
            {!debouncedSearch && status === "all" && (
              <Button asChild className="mt-2">
                <Link href="/purchases/new"><Plus className="h-4 w-4" />Criar o primeiro pedido</Link>
              </Button>
            )}
          </div>
        ) : (
          <div className={`overflow-x-auto transition-opacity ${isPlaceholderData ? "opacity-60" : ""}`}>
            <table className="w-full text-sm">
              <thead className="bg-slate-100 text-xs text-slate-700 dark:bg-muted dark:text-muted-foreground">
                <tr>
                  <th className="px-4 py-2.5 text-left font-semibold">Pedido</th>
                  <th className="px-3 py-2.5 text-left font-semibold">Fornecedor</th>
                  <th className="px-3 py-2.5 text-left font-semibold">Status</th>
                  <th className="px-3 py-2.5 text-center font-semibold">Previsão</th>
                  <th className="px-3 py-2.5 text-left font-semibold">Recebimento</th>
                  <th className="px-3 py-2.5 text-right font-semibold">Total</th>
                </tr>
              </thead>
              <tbody>
                {data?.data.map((order) => {
                  const progress = order.quantity > 0 ? (order.received_quantity / order.quantity) * 100 : 0;
                  return (
                    <tr
                      key={order.id}
                      onClick={() => router.push(`/purchases/${order.id}`)}
                      className="cursor-pointer border-t border-border transition-colors hover:bg-slate-50 dark:hover:bg-muted/50"
                    >
                      <td className="px-4 py-3">
                        <Link
                          href={`/purchases/${order.id}`}
                          onClick={(e) => e.stopPropagation()}
                          className="font-semibold text-foreground hover:text-blue-700 dark:hover:text-blue-300"
                        >
                          nº {order.number}
                        </Link>
                        <p className="text-xs text-muted-foreground">{formatDate(order.created_at)}</p>
                      </td>
                      <td className="px-3 py-3">
                        <p className="font-medium">{order.vendor_name}</p>
                        <p className="text-xs text-muted-foreground">
                          {order.items_count} {order.items_count === 1 ? "produto" : "produtos"}
                        </p>
                      </td>
                      <td className="px-3 py-3"><OrderStatusBadge status={order.status} late={order.late} /></td>
                      <td className="px-3 py-3 text-center tabular-nums">{formatDate(order.expected_date)}</td>
                      <td className="px-3 py-3">
                        <div className="flex min-w-32 items-center gap-2">
                          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-200 dark:bg-muted">
                            <div className="h-full rounded-full bg-emerald-500" style={{ width: `${progress}%` }} />
                          </div>
                          <span className="text-xs text-muted-foreground tabular-nums">
                            {order.received_quantity}/{order.quantity}
                          </span>
                        </div>
                      </td>
                      <td className="px-3 py-3 text-right font-semibold tabular-nums">{money(order.total)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {data && data.total_pages > 1 && (
          <div className="border-t border-border p-3">
            <DataPagination
              currentPage={data.page}
              totalPages={data.total_pages}
              pageRange={getPageRange(data.page, data.total_pages)}
              goToPage={setPage}
            />
          </div>
        )}
      </section>
    </div>
  );
}
