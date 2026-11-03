"use client";

import { useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  FileText,
  Loader2,
  Settings2,
} from "lucide-react";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { FiscalStatusBadge } from "@/components/Fiscal/FiscalStatusBadge";
import { FiscalDocumentActions } from "@/components/Fiscal/FiscalDocumentActions";
import { brl } from "@/components/DashCard";
import { useFiscalDocuments, useFiscalSettings } from "@/hooks/useFiscal";
import { useModuleAccess } from "@/hooks/useModuleAccess";
import { cn } from "@/lib/utils";

const PER_PAGE = 20;

const dateTime = (iso: string) =>
  new Date(iso).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });

/** Notas fiscais (NFC-e) das vendas, com as que precisam de atenção em destaque */
export default function NfcePage() {
  const [problems, setProblems] = useState(false);
  const [page, setPage] = useState(1);
  const { data: settings } = useFiscalSettings();
  const { canAccess } = useModuleAccess();
  const isAdmin = canAccess(undefined, "ADMIN");
  const { data, isLoading, isPlaceholderData } = useFiscalDocuments({
    problems,
    page,
    per_page: PER_PAGE,
  });
  const docs = data?.documents ?? [];
  const totalPages = Math.max(1, Math.ceil((data?.total ?? 0) / PER_PAGE));

  const tab = (value: boolean, label: string) => (
    <button
      type="button"
      onClick={() => {
        setProblems(value);
        setPage(1);
      }}
      className={cn(
        "rounded-full px-3 py-1 text-sm font-medium transition-colors",
        problems === value
          ? "bg-primary text-primary-foreground"
          : "text-muted-foreground hover:bg-muted",
      )}
    >
      {label}
    </button>
  );

  return (
    <div className="space-y-6 p-6">
      <Header
        title="Notas fiscais"
        text="NFC-e emitidas nas vendas: imprima, reemita as que falharam e cancele quando precisar."
      />

      {settings && !settings.enabled && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200">
          <span className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />A emissão de NFC-e está
            desligada: as vendas saem sem nota.
          </span>
          {isAdmin && (
            <Button asChild size="sm" variant="outline">
              <Link href="/config/fiscal">
                <Settings2 className="h-4 w-4" /> Configurar
              </Link>
            </Button>
          )}
        </div>
      )}

      <section className="overflow-hidden rounded-2xl border border-border/70 bg-card">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b p-4">
          <h2 className="flex items-center gap-2 text-sm font-semibold">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary/10 text-primary">
              <FileText className="h-4 w-4" />
            </span>
            Notas
            {data && (
              <span className="font-normal text-muted-foreground">
                · {data.total}
              </span>
            )}
          </h2>
          <div className="flex gap-1 rounded-full border p-1">
            {tab(false, "Todas")}
            {tab(true, "Precisam de atenção")}
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center p-10">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : docs.length === 0 ? (
          <p className="p-10 text-center text-sm text-muted-foreground">
            {problems
              ? "Nenhuma nota com problema."
              : "Nenhuma nota emitida ainda."}
          </p>
        ) : (
          <div
            className={cn("overflow-x-auto", isPlaceholderData && "opacity-60")}
          >
            <table className="w-full text-sm">
              <thead className="bg-slate-100 text-xs text-slate-700 dark:bg-muted dark:text-muted-foreground">
                <tr>
                  <th className="px-4 py-2.5 text-left font-semibold">Venda</th>
                  <th className="px-3 py-2.5 text-right font-semibold">
                    Total
                  </th>
                  <th className="px-3 py-2.5 text-left font-semibold">Nota</th>
                  <th className="px-3 py-2.5 text-left font-semibold">
                    Situação
                  </th>
                  <th className="w-16 px-4 py-2.5" />
                </tr>
              </thead>
              <tbody>
                {docs.map((d) => (
                  <tr key={d.id} className="border-t border-border align-top">
                    <td className="px-4 py-3">
                      <p className="font-medium">
                        {d.customer_name || "Consumidor final"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        <span className="font-mono">
                          {d.sale_id.slice(0, 8)}
                        </span>{" "}
                        · {dateTime(d.sale_at)}
                      </p>
                    </td>
                    <td className="px-3 py-3 text-right font-semibold tabular-nums">
                      {brl(d.sale_total)}
                    </td>
                    <td className="px-3 py-3">
                      {d.number ? (
                        <>
                          <p>nº {d.number}</p>
                          {d.access_key && (
                            <p className="font-mono text-[11px] text-muted-foreground">
                              {d.access_key.replace(/(\d{4})/g, "$1 ").trim()}
                            </p>
                          )}
                        </>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="max-w-md px-3 py-3">
                      <FiscalStatusBadge document={d} />
                      {(d.reject_reason || d.error_message) &&
                        d.status !== "AUTHORIZED" && (
                          <p
                            className={cn(
                              "mt-1 text-xs",
                              d.status === "PENDING" ||
                                d.status === "PROCESSING"
                                ? "text-muted-foreground"
                                : "text-destructive",
                            )}
                          >
                            {d.status_code && d.status === "REJECTED"
                              ? `${d.status_code} – `
                              : ""}
                            {d.reject_reason ?? d.error_message}
                          </p>
                        )}
                      {d.status === "CANCELLED" && d.cancel_reason && (
                        <p className="mt-1 text-xs text-muted-foreground">
                          {d.cancel_reason}
                        </p>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <FiscalDocumentActions saleId={d.sale_id} document={d} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-end gap-2 border-t p-3 text-sm">
            <Button
              variant="outline"
              size="icon"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
              aria-label="Página anterior"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="tabular-nums text-muted-foreground">
              {page} de {totalPages}
            </span>
            <Button
              variant="outline"
              size="icon"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
              aria-label="Próxima página"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </section>
    </div>
  );
}
