"use client";

import { useEffect, useState } from "react";
import { FluxoCaixaHeader } from "./components/FluxoCaixaHeader";
import { ResumoCards } from "./components/ResumoCards";
import { FluxoCaixaChart } from "./components/FluxoCaixaChart";
import { CategoriaCard } from "./components/CategoriaCard";
import { ComparativoPeriodos } from "./components/ComparativoPeriodos";
import { useCashFlow } from "@/hooks/useCashFlow";
import { translateVisualizacao } from "@/app/utils/formatVisualizacao";
import { Loading } from "@/components/Loading";

export interface ComparativoPeriodo {
  periodo: string;
  entradas: number;
  saidas: number;
  saldo: number;
}

export type Periodo = "7" | "15" | "30" | "90";
export type TipoVisualizacao = "diario" | "semanal" | "mensal";

export default function FluxoCaixa() {
  const [periodo, setPeriodo] = useState<Periodo>("7");
  const [tipoVisualizacao, setTipoVisualizacao] =
    useState<TipoVisualizacao>("diario");

  const { cashFlowTotalSummary, refetch, loading } = useCashFlow({
    period: translateVisualizacao(tipoVisualizacao),
    quantity: Number(periodo),
  });

  useEffect(() => {
    refetch();
  }, [periodo, tipoVisualizacao, refetch]);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="p-6 space-y-6">
      <FluxoCaixaHeader
        periodo={periodo}
        onPeriodoChange={setPeriodo}
        tipoVisualizacao={tipoVisualizacao}
        onTipoVisualizacaoChange={setTipoVisualizacao}
      />

      <ResumoCards
        saldoAtual={cashFlowTotalSummary?.total ?? 0}
        totalEntradas={cashFlowTotalSummary?.total_inflow ?? 0}
        totalSaidas={cashFlowTotalSummary?.total_outflow ?? 0}
        previsao5Dias={cashFlowTotalSummary?.forecast ?? 0}
      />

      <FluxoCaixaChart dados={cashFlowTotalSummary?.summary ?? []} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CategoriaCard
          titulo="Entradas por Categoria"
          categorias={cashFlowTotalSummary?.total_categories_in_flow ?? []}
          corBarra="bg-secondary"
        />
        <CategoriaCard
          titulo="Saídas por Categoria"
          categorias={cashFlowTotalSummary?.total_categories_out_flow ?? []}
          corBarra="bg-destructive"
        />
      </div>

      <ComparativoPeriodos dados={[]} />
    </div>
  );
}
