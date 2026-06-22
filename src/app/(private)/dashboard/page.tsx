"use client";

import { CardsStatusFinance } from "./components/CardsStatusFinance";
import { SalesSummaryCard } from "./components/SalesSummaryCard";
import { AlertsCard } from "./components/AlertsCard";
import { CashFlowChart } from "./components/CashFlowChart";
import { TopProductsChart } from "./components/TopProductsChart";
import { PaymentMethodsChart } from "./components/PaymentMethodsChart";
import { StockValueCard } from "./components/StockValueCard";
import { AccountsPayableCard } from "./components/AccountsPayableCard";

export default function DashBoard() {
  // Centralização dos dados fictícios (fácil substituição por requisições de API no futuro)
  const saldoAtual = {
    caixa: 15400.5,
    banco: 45200.3,
    contasReceber: 28500.0,
    contasPagar: 12800.75,
  };

  const vendas = {
    mesAtual: 125400.5,
    mesAnterior: 98200.3,
    crescimento: 27.7,
  };

  const fluxoCaixaDados = [
    { data: "01/12", entrada: 4500, saida: 2300 },
    { data: "02/12", entrada: 3200, saida: 1800 },
    { data: "03/12", entrada: 5400, saida: 3100 },
    { data: "04/12", entrada: 6200, saida: 2900 },
    { data: "05/12", entrada: 4800, saida: 3500 },
    { data: "06/12", entrada: 7100, saida: 4200 },
    { data: "07/12", entrada: 5900, saida: 3800 },
  ];

  const topProdutos = [
    { nome: "Produto A", vendas: 4500, lucro: 1350 },
    { nome: "Produto B", vendas: 3200, lucro: 960 },
    { nome: "Produto C", vendas: 2800, lucro: 840 },
    { nome: "Produto D", vendas: 2100, lucro: 630 },
  ];

  const distribuicaoVendas = [
    { name: "À Vista", value: 45, color: "hsl(var(--primary))" },
    { name: "Cartão", value: 35, color: "hsl(var(--secondary))" },
    { name: "Parcelado", value: 20, color: "hsl(var(--accent))" },
  ];

  const alertas = [
    { tipo: "vencimento", mensagem: "5 contas vencem hoje", urgencia: "alta" },
    {
      tipo: "estoque",
      mensagem: "3 produtos com estoque crítico",
      urgencia: "media",
    },
    { tipo: "receber", mensagem: "R$ 8.500 em atraso", urgencia: "alta" },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Título da Página */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Dashboard Financeiro
        </h1>
        <p className="text-muted-foreground">
          Visão geral da situação financeira da empresa
        </p>
      </div>

      {/* Cards Superiores de Status Geral */}
      <CardsStatusFinance />

      {/* Grid: Resumo de Vendas e Painel de Alertas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <SalesSummaryCard data={vendas} />
        <AlertsCard data={alertas} />
      </div>

      {/* Grid: Seção de Gráficos Analíticos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CashFlowChart data={fluxoCaixaDados} />
        <TopProductsChart data={topProdutos} />
      </div>

      {/* Grid: Distribuição, Inventário e Pendências Financeiras */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <PaymentMethodsChart data={distribuicaoVendas} />
        <StockValueCard />
        <AccountsPayableCard totalPendente={saldoAtual.contasPagar} />
      </div>
    </div>
  );
}
