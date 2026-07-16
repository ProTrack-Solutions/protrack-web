"use client";

import { useState, useMemo } from "react";
import { FluxoCaixaHeader } from "./components/FluxoCaixaHeader";
import { ResumoCards } from "./components/ResumoCards";
import { FluxoCaixaChart } from "./components/FluxoCaixaChart";
import { CategoriaCard } from "./components/CategoriaCard";
import { ComparativoPeriodos } from "./components/ComparativoPeriodos";

export interface FluxoCaixaDia {
  data: string;
  entradas: number;
  saidas: number;
  saldo: number;
  tipo?: "historico" | "projecao";
}

export interface CategoriaValor {
  categoria: string;
  valor: number;
  percentual: number;
}

export interface ComparativoPeriodo {
  periodo: string;
  entradas: number;
  saidas: number;
  saldo: number;
}

export type Periodo = "7dias" | "30dias" | "90dias" | "1ano";
export type TipoVisualizacao = "diario" | "semanal" | "mensal";

export const fluxoCaixaHistorico: FluxoCaixaDia[] = [
  { data: "01/12", entradas: 4500, saidas: 2300, saldo: 2200 },
  { data: "02/12", entradas: 3200, saidas: 1800, saldo: 3600 },
  { data: "03/12", entradas: 5400, saidas: 3100, saldo: 5900 },
  { data: "04/12", entradas: 6200, saidas: 2900, saldo: 9200 },
  { data: "05/12", entradas: 4800, saidas: 3500, saldo: 10500 },
  { data: "06/12", entradas: 7100, saidas: 4200, saldo: 13400 },
  { data: "07/12", entradas: 5900, saidas: 3800, saldo: 15500 },
  { data: "08/12", entradas: 4300, saidas: 2900, saldo: 16900 },
  { data: "09/12", entradas: 6800, saidas: 4100, saldo: 19600 },
  { data: "10/12", entradas: 5200, saidas: 3600, saldo: 21200 },
];

export const projecaoFutura: FluxoCaixaDia[] = [
  {
    data: "11/12",
    entradas: 5500,
    saidas: 3200,
    saldo: 23500,
    tipo: "projecao",
  },
  {
    data: "12/12",
    entradas: 4800,
    saidas: 2800,
    saldo: 25500,
    tipo: "projecao",
  },
  {
    data: "13/12",
    entradas: 6200,
    saidas: 3900,
    saldo: 27800,
    tipo: "projecao",
  },
  {
    data: "14/12",
    entradas: 5900,
    saidas: 3400,
    saldo: 30300,
    tipo: "projecao",
  },
  {
    data: "15/12",
    entradas: 7100,
    saidas: 4500,
    saldo: 32900,
    tipo: "projecao",
  },
];

export const categoriasEntrada: CategoriaValor[] = [
  { categoria: "Vendas à Vista", valor: 45200, percentual: 65 },
  { categoria: "Recebimentos", valor: 18400, percentual: 26.5 },
  { categoria: "Outros", valor: 5900, percentual: 8.5 },
];

export const categoriasSaida: CategoriaValor[] = [
  { categoria: "Fornecedores", valor: 28500, percentual: 55 },
  { categoria: "Salários", valor: 12800, percentual: 25 },
  { categoria: "Despesas Operacionais", valor: 8200, percentual: 16 },
  { categoria: "Impostos", valor: 2100, percentual: 4 },
];

export const comparativoPeriodos: ComparativoPeriodo[] = [
  { periodo: "Este Mês", entradas: 69500, saidas: 51600, saldo: 17900 },
  { periodo: "Mês Anterior", entradas: 58200, saidas: 45800, saldo: 12400 },
  {
    periodo: "Mesmo Mês Ano Anterior",
    entradas: 52100,
    saidas: 41200,
    saldo: 10900,
  },
];

export default function FluxoCaixa() {
  const [periodo, setPeriodo] = useState<Periodo>("30dias");
  const [tipoVisualizacao, setTipoVisualizacao] =
    useState<TipoVisualizacao>("diario");

  const dadosCompletos = useMemo(
    () => [...fluxoCaixaHistorico, ...projecaoFutura],
    [],
  );

  const totalEntradas = useMemo(
    () => fluxoCaixaHistorico.reduce((sum, item) => sum + item.entradas, 0),
    [],
  );

  const totalSaidas = useMemo(
    () => fluxoCaixaHistorico.reduce((sum, item) => sum + item.saidas, 0),
    [],
  );

  const saldoAtual = totalEntradas - totalSaidas;

  // Comparado ao saldo do mês anterior (mock)
  const crescimento = ((saldoAtual - 12400) / 12400) * 100;

  const previsao5Dias = useMemo(
    () =>
      projecaoFutura.reduce(
        (sum, item) => sum + (item.entradas - item.saidas),
        0,
      ),
    [],
  );

  return (
    <div className="p-6 space-y-6">
      <FluxoCaixaHeader
        periodo={periodo}
        onPeriodoChange={setPeriodo}
        tipoVisualizacao={tipoVisualizacao}
        onTipoVisualizacaoChange={setTipoVisualizacao}
      />

      <ResumoCards
        saldoAtual={saldoAtual}
        crescimento={crescimento}
        totalEntradas={totalEntradas}
        totalSaidas={totalSaidas}
        previsao5Dias={previsao5Dias}
      />

      <FluxoCaixaChart dados={dadosCompletos} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CategoriaCard
          titulo="Entradas por Categoria"
          categorias={categoriasEntrada}
          corBarra="bg-secondary"
        />
        <CategoriaCard
          titulo="Saídas por Categoria"
          categorias={categoriasSaida}
          corBarra="bg-destructive"
        />
      </div>

      <ComparativoPeriodos dados={comparativoPeriodos} />
    </div>
  );
}
