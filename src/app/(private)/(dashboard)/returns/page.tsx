"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertCircle, ArrowLeftRight, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/DashCard";
import { DataPagination } from "@/components/DataPagination";
import { useReturns } from "@/hooks/useReturns";
import { ReturnKind, ReturnListItem } from "@/interfaces/returns.interface";
import { getApiErrorMessage } from "@/utils/apiError";
import { getPageRange } from "@/utils/pagination";
import { KindBadge } from "./components/KindBadge";
import { formatDateTime, methodLabel, money } from "./components/format";

const PER_PAGE = 20;

const KIND_FILTERS: { value: ReturnKind | "all"; label: string }[] = [
  { value: "all", label: "Todas" },
  { value: "return", label: "Devoluções" },
  { value: "exchange", label: "Trocas" },
];

function useDebouncedValue<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

/** Para onde foi o valor devolvido, em uma linha */
function Outcome({ r }: { r: ReturnListItem }) {
  const parts: { text: string; className: string }[] = [];
  if (r.kind === "exchange") {
    parts.push({ text: `Levou ${money(r.exchange_total)}`, className: "text-foreground" });
  }
  if (r.difference_paid > 0) {
    parts.push({ text: `pagou ${money(r.difference_paid)}`, className: "text-blue-700 dark:text-blue-300" });
  }
  if (r.debt_reduction > 0) {
    parts.push({ text: `abateu ${money(r.debt_reduction)}`, className: "text-amber-800 dark:text-amber-300" });
  }
  if (r.credit_amount > 0) {
    parts.push({ text: `vale ${money(r.credit_amount)}`, className: "text-pink-700 dark:text-pink-300" });
  }
  if (r.refund_amount > 0) {
    parts.push({
      text: `devolvido ${money(r.refund_amount)} (${methodLabel(r.refund_method).toLowerCase()})`,
      className: "text-emerald-700 dark:text-emerald-400",
    });
  }
  return (
    <span className="text-xs">
      {parts.map((p, i) => (
        <span key={i} className={p.className}>
          {i > 0 && <span className="text-muted-foreground"> · </span>}
          {p.text}
        </span>
      ))}
    </span>
  );
}

export default function ReturnsPage() {
  const router = useRouter();
  const [kind, setKind] = useState<ReturnKind | "all">("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebouncedValue(search.trim(), 300);

  const { data, isLoading, isError, error, isPlaceholderData, refetch } = useReturns({
    kind: kind === "all" ? undefined : kind,
    search: debouncedSearch || undefined,
    page,
    per_page: PER_PAGE,
  });
  const totalPages = data ? Math.max(Math.ceil(data.total / data.per_page), 1) : 1;

  return (
    <div className="space-y-6 p-6">
      <div className="dash-in flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Trocas e devoluções</h1>
          <p className="mt-1 text-muted-foreground">
            Itens que voltaram das vendas: estoque, vale-troca e dinheiro devolvido.
          </p>
        </div>
        <Button asChild className="h-10">
          <Link href="/returns/new">
            <Plus className="h-4 w-4" />
            Nova troca/devolução
          </Link>
        </Button>
      </div>

      <section className="dash-in overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-soft)]">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border p-4">
          <div role="radiogroup" aria-label="Tipo" className="flex flex-wrap gap-1.5">
            {KIND_FILTERS.map((option) => {
              const active = option.value === kind;
              return (
                <button
                  key={option.value}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  onClick={() => {
                    setKind(option.value);
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
          <div className="relative w-full sm:w-72">
            <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Cliente, produto ou nº"
              aria-label="Buscar trocas e devoluções"
              className="h-9 pl-9"
            />
          </div>
        </div>

        {isError && !data ? (
          <div className="flex flex-col items-center gap-3 p-10 text-center">
            <AlertCircle className="h-8 w-8 text-destructive" />
            <p className="font-medium">{getApiErrorMessage(error, "Não foi possível carregar as devoluções.")}</p>
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
            <ArrowLeftRight className="h-8 w-8 text-muted-foreground" />
            <p className="font-medium text-foreground">
              {debouncedSearch || kind !== "all" ? "Nada encontrado." : "Nenhuma troca ou devolução ainda."}
            </p>
            {!debouncedSearch && kind === "all" && (
              <Button asChild className="mt-2">
                <Link href="/returns/new"><Plus className="h-4 w-4" />Registrar a primeira</Link>
              </Button>
            )}
          </div>
        ) : (
          <div className={`overflow-x-auto transition-opacity ${isPlaceholderData ? "opacity-60" : ""}`}>
            <table className="w-full text-sm">
              <thead className="bg-slate-100 text-xs text-slate-700 dark:bg-muted dark:text-muted-foreground">
                <tr>
                  <th className="px-4 py-2.5 text-left font-semibold">Nº</th>
                  <th className="px-3 py-2.5 text-left font-semibold">Cliente</th>
                  <th className="px-3 py-2.5 text-left font-semibold">Tipo</th>
                  <th className="px-3 py-2.5 text-right font-semibold">Devolvido</th>
                  <th className="px-3 py-2.5 text-left font-semibold">Resultado</th>
                  <th className="px-4 py-2.5 text-left font-semibold">Operador</th>
                </tr>
              </thead>
              <tbody>
                {data?.data.map((r) => (
                  <tr
                    key={r.id}
                    onClick={() => router.push(`/returns/${r.id}`)}
                    className="cursor-pointer border-t border-border transition-colors hover:bg-slate-50 dark:hover:bg-muted/50"
                  >
                    <td className="px-4 py-3">
                      <Link
                        href={`/returns/${r.id}`}
                        onClick={(e) => e.stopPropagation()}
                        className="font-semibold text-foreground hover:text-blue-700 dark:hover:text-blue-300"
                      >
                        nº {r.number}
                      </Link>
                      <p className="text-xs text-muted-foreground">{formatDateTime(r.created_at)}</p>
                    </td>
                    <td className="px-3 py-3">
                      <p className="font-medium">{r.customer_name || "Consumidor final"}</p>
                      <p className="text-xs text-muted-foreground">
                        {r.items_count} {r.items_count === 1 ? "item" : "itens"}
                      </p>
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <KindBadge kind={r.kind} />
                        {r.out_of_window && (
                          <span className="text-xs font-medium text-amber-800 dark:text-amber-300" title="Aceita fora do prazo">
                            fora do prazo
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-3 py-3 text-right font-semibold tabular-nums">{money(r.returned_total)}</td>
                    <td className="px-3 py-3"><Outcome r={r} /></td>
                    <td className="px-4 py-3 text-muted-foreground">{r.created_by_name || "—"}</td>
                  </tr>
                ))}
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
      </section>
    </div>
  );
}
