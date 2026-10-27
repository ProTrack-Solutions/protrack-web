"use client";

import { useState } from "react";
import { AlertCircle, Clock, RefreshCw } from "lucide-react";
import { Skeleton } from "@/components/DashCard";
import { useCurrentCashSession } from "@/hooks/useCashRegister";
import { OpenRegisterCard } from "./components/OpenRegisterCard";
import { OpenRegisterView } from "./components/OpenRegisterView";
import { SessionsHistory } from "./components/SessionsHistory";
import { SessionDetailDialog } from "./components/SessionDetailDialog";
import { formatDuration, formatTime } from "./components/format";

// Caixa do operador logado: abre o turno, registra sangria/suprimento e fecha
// conferindo o dinheiro contado com o esperado. O resumo vem da API e é
// atualizado sozinho a cada 30s, então vendas feitas em outra aba aparecem aqui.
export default function CashRegisterPage() {
  const {
    data: current,
    isLoading,
    isError,
    isFetching,
    refetch,
  } = useCurrentCashSession();
  const [reportId, setReportId] = useState<string | null>(null);

  const session = current?.session;

  return (
    <div className="space-y-6 p-6">
      <div className="dash-in flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Caixa
            </h1>
            {!isLoading &&
              !isError &&
              (session ? (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary/15 px-3 py-1 text-xs font-semibold text-[hsl(150_45%_32%)]">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-secondary" />
                  Aberto
                </span>
              ) : (
                <span className="inline-flex items-center rounded-full bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground">
                  Fechado
                </span>
              ))}
          </div>
          <div className="mt-1 flex items-center gap-2 text-muted-foreground">
            {session ? (
              <>
                <Clock className="h-4 w-4" />
                Aberto às {formatTime(session.opened_at)} · há{" "}
                {formatDuration(session.opened_at)}
              </>
            ) : (
              "Abertura, sangria, suprimento e fechamento do seu turno."
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={() => refetch()}
          disabled={isFetching}
          aria-label="Atualizar dados"
          className="grid h-9 w-9 cursor-pointer place-items-center rounded-full border border-border bg-card text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:cursor-default"
        >
          <RefreshCw
            className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`}
          />
        </button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }, (_, i) => (
            <Skeleton key={i} className="h-32 rounded-2xl" />
          ))}
        </div>
      ) : isError ? (
        <div className="dash-in flex flex-col items-center gap-3 rounded-2xl border border-destructive/30 bg-destructive/5 p-10 text-center">
          <AlertCircle className="h-8 w-8 text-destructive" />
          <p className="font-medium text-foreground">
            Não foi possível carregar o caixa.
          </p>
          <button
            type="button"
            onClick={() => refetch()}
            className="cursor-pointer rounded-full bg-primary px-4 py-1.5 text-sm font-semibold text-primary-foreground hover:opacity-90"
          >
            Tentar novamente
          </button>
        </div>
      ) : current ? (
        <OpenRegisterView detail={current} onClosed={setReportId} />
      ) : (
        <OpenRegisterCard />
      )}

      <SessionsHistory onSelect={setReportId} />

      <SessionDetailDialog id={reportId} onClose={() => setReportId(null)} />
    </div>
  );
}
