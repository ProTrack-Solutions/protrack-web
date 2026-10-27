"use client";

import { useState } from "react";
import { ChevronRight, History } from "lucide-react";
import { DashCard, Skeleton, brl } from "@/components/DashCard";
import { DataPagination } from "@/components/DataPagination";
import { useCashSessions } from "@/hooks/useCashRegister";
import { getPageRange } from "@/utils/pagination";
import { DifferenceBadge } from "./DifferenceBadge";
import { EmptyState } from "./SummaryParts";
import { formatDateTime, formatDuration } from "./format";

const th =
  "px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground";

export function SessionsHistory({
  onSelect,
}: {
  onSelect: (id: string) => void;
}) {
  const [page, setPage] = useState(1);
  const { data, isLoading, isPlaceholderData } = useCashSessions(page);
  const sessions = data?.data ?? [];
  const totalPages = data?.total_pages || 1;
  // Mostra a coluna de operador só quando há caixas de mais de uma pessoa (visão do administrador)
  const showOperator = new Set(sessions.map((s) => s.user_id)).size > 1;

  return (
    <DashCard
      title="Histórico de caixas"
      icon={<History className="h-4 w-4" />}
      delay={420}
    >
      {/* A tabela encosta nas bordas do card */}
      <div className="-mx-5 -mb-5">
        <div
          className={`overflow-x-auto transition-opacity ${isPlaceholderData ? "opacity-60" : ""}`}
        >
          <table className="w-full min-w-[760px] text-sm">
            <thead className="border-y border-border bg-muted/40 text-left">
              <tr>
                {showOperator && <th className={th}>Operador</th>}
                <th className={th}>Abertura</th>
                <th className={th}>Duração</th>
                <th className={`${th} text-right`}>Vendas</th>
                <th className={`${th} text-right`}>Esperado</th>
                <th className={`${th} text-right`}>Contado</th>
                <th className={`${th} text-center`}>Conferência</th>
                <th className="w-10" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {isLoading &&
                Array.from({ length: 4 }, (_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 7 }, (_, j) => (
                      <td key={j} className="px-4 py-4">
                        <Skeleton className="h-4 w-20" />
                      </td>
                    ))}
                  </tr>
                ))}

              {sessions.map((s) => {
                const open = s.status === "open";
                return (
                  <tr
                    key={s.id}
                    onClick={() => onSelect(s.id)}
                    className="group cursor-pointer transition-colors hover:bg-muted/40"
                  >
                    {showOperator && (
                      <td className="px-4 py-3 font-medium text-foreground">
                        {s.user_name}
                      </td>
                    )}
                    <td className="px-4 py-3 text-foreground">
                      {formatDateTime(s.opened_at)}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {formatDuration(s.opened_at, s.closed_at)}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums text-foreground">
                      {open ? "—" : brl(s.sales_total ?? 0)}
                      {!open && (
                        <span className="block text-xs text-muted-foreground">
                          {s.sales_count ?? 0}{" "}
                          {s.sales_count === 1 ? "venda" : "vendas"}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums text-muted-foreground">
                      {open ? "—" : brl(s.expected_cash ?? 0)}
                    </td>
                    <td className="px-4 py-3 text-right font-semibold tabular-nums text-foreground">
                      {open ? "—" : brl(s.counted_cash ?? 0)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {open ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
                          Aberto
                        </span>
                      ) : (
                        <DifferenceBadge value={s.difference ?? 0} />
                      )}
                    </td>
                    <td className="pr-4 text-muted-foreground">
                      <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {!isLoading && sessions.length === 0 && (
          <EmptyState text="Nenhum caixa aberto até agora." />
        )}

        <DataPagination
          className="mx-0 w-auto border-t border-border/60 py-2"
          currentPage={page}
          totalPages={totalPages}
          pageRange={getPageRange(page, totalPages)}
          goToPage={(p) => p >= 1 && p <= totalPages && setPage(p)}
        />
      </div>
    </DashCard>
  );
}
