"use client";

import { useEffect, useState } from "react";
import { AlertCircle, Receipt, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/DashCard";
import { DataPagination } from "@/components/DataPagination";
import { useSalesForReturn } from "@/hooks/useReturns";
import { getApiErrorMessage } from "@/utils/apiError";
import { getPageRange } from "@/utils/pagination";
import { getPaymentMethodLabel } from "@/utils/paymentMethodFormat";
import { formatDateTime, money } from "./format";

function useDebouncedValue<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

/** Primeiro passo: achar a venda pelo cliente, produto ou código */
export function SalePicker({ onPick }: { onPick: (saleId: string) => void }) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const debounced = useDebouncedValue(search.trim(), 300);
  const { data, isLoading, isError, error, isPlaceholderData, refetch } =
    useSalesForReturn(debounced, page);
  const totalPages = data ? Math.max(Math.ceil(data.total / data.per_page), 1) : 1;

  return (
    <section className="dash-in overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-soft)]">
      <div className="border-b border-border p-4">
        <h2 className="font-semibold text-foreground">Qual venda o cliente quer trocar ou devolver?</h2>
        <p className="mt-0.5 text-sm text-muted-foreground">
          Busque pelo nome do cliente, um produto ou o começo do código da venda (está no recibo).
        </p>
        <div className="relative mt-3 max-w-md">
          <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            autoFocus
            type="search"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Cliente, produto ou código"
            aria-label="Buscar venda"
            className="h-10 pl-9"
          />
        </div>
      </div>

      {isError && !data ? (
        <div className="flex flex-col items-center gap-3 p-10 text-center">
          <AlertCircle className="h-8 w-8 text-destructive" />
          <p className="font-medium">{getApiErrorMessage(error, "Não foi possível buscar as vendas.")}</p>
          <Button onClick={() => refetch()} className="cursor-pointer">Tentar novamente</Button>
        </div>
      ) : isLoading ? (
        <div className="space-y-2 p-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full" />
          ))}
        </div>
      ) : data && data.data.length === 0 ? (
        <div className="flex flex-col items-center gap-2 px-6 py-14 text-center">
          <Receipt className="h-8 w-8 text-muted-foreground" />
          <p className="font-medium text-foreground">Nenhuma venda encontrada.</p>
          <p className="text-sm text-muted-foreground">Vendas canceladas não aparecem aqui.</p>
        </div>
      ) : (
        <ul className={`divide-y divide-border transition-opacity ${isPlaceholderData ? "opacity-60" : ""}`}>
          {data?.data.map((sale) => {
            const fullyReturned = sale.items_count > 0 && sale.returned_count >= sale.items_count;
            return (
              <li key={sale.id}>
                <button
                  type="button"
                  disabled={fullyReturned}
                  onClick={() => onPick(sale.id)}
                  className="flex w-full cursor-pointer flex-wrap items-center justify-between gap-3 px-4 py-3 text-left transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:bg-transparent dark:hover:bg-muted/50"
                >
                  <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold text-foreground">
                        {sale.customer_name || "Consumidor final"}
                      </span>
                      <span className="font-mono text-xs text-muted-foreground">{sale.id.slice(0, 8)}</span>
                      {sale.returned_count > 0 && (
                        <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-900 ring-1 ring-inset ring-amber-300 dark:bg-amber-500/15 dark:text-amber-300 dark:ring-amber-500/30">
                          {fullyReturned ? "Tudo devolvido" : `${sale.returned_count} de ${sale.items_count} devolvidos`}
                        </span>
                      )}
                    </span>
                    <span className="mt-0.5 block truncate text-sm text-muted-foreground">{sale.products}</span>
                  </span>
                  <span className="text-right">
                    <span className="block font-semibold tabular-nums">{money(sale.total_amount)}</span>
                    <span className="block text-xs text-muted-foreground">
                      {formatDateTime(sale.created_at)} · {getPaymentMethodLabel(sale.payment_method)}
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
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
    </section>
  );
}
