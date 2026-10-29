"use client";

import { useState } from "react";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Skeleton } from "@/components/DashCard";
import { useCurrentCashSession } from "@/hooks/useCashRegister";
import { OpenRegisterCard } from "./components/OpenRegisterCard";
import { RegistersBar } from "./components/RegisterPicker";
import { OpenRegisterView } from "./components/OpenRegisterView";
import { SessionsHistory } from "./components/SessionsHistory";
import { SessionDetailDialog } from "./components/SessionDetailDialog";

// Tela do caixa físico deste computador. Em cima, a situação de todos os caixas
// da loja (quando há mais de um); no meio, o turno do caixa deste computador:
// abertura, sangria/suprimento e fechamento conferindo a gaveta. Qualquer
// operador vende e mexe no turno aberto. O resumo é atualizado a cada 30s, então
// vendas feitas em outro computador do mesmo caixa aparecem aqui.
export default function CashRegisterPage() {
  const {
    data: current,
    isLoading,
    isError,
    isFetching,
    refetch,
    register,
    needsChoice,
  } = useCurrentCashSession();
  const [reportId, setReportId] = useState<string | null>(null);

  return (
    <div className="space-y-6 p-6">
      <div className="dash-in flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Caixa
          </h1>
          <p className="mt-1 text-muted-foreground">
            Abertura, sangria, suprimento e fechamento dos turnos.
          </p>
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

      <RegistersBar />

      {needsChoice ? null : isLoading ? (
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
      ) : !register ? null : current ? (
        <OpenRegisterView
          registerName={register.name}
          detail={current}
          onClosed={setReportId}
        />
      ) : (
        // key: trocar de caixa limpa o valor digitado na abertura
        <OpenRegisterCard key={register.id} register={register} />
      )}

      <SessionsHistory registerId={register?.id} onSelect={setReportId} />

      <SessionDetailDialog id={reportId} onClose={() => setReportId(null)} />
    </div>
  );
}
