"use client";

import { CardsStatusFinance } from "./components/CardsStatusFinance";
import { SalesSummaryCard } from "./components/SalesSummaryCard";
import { AlertsCard } from "./components/AlertsCard";
import { CashFlowChart } from "./components/CashFlowChart";
import { TopProductsChart } from "./components/TopProductsChart";
import { PaymentMethodsChart } from "./components/PaymentMethodsChart";
import { StockValueCard } from "./components/StockValueCard";
import { AccountsPayableCard } from "./components/AccountsPayableCard";
import { Header } from "@/components/Header";
import { useDashboard } from "@/hooks/useDashboard";
import { Loading } from "@/components/Loading";

export default function DashBoard() {
  const {
    loading,
    totalSalesPedding,
    salesSummaryData,
    paymentMethodsStats,
    topProducts,
    totalValueInStock,
    billsPayableSummary,
    cashFlow,
    inventoryTurnover,
    announcements,
  } = useDashboard();

  console.log("cashFlow", cashFlow);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="p-6 space-y-6">
      {/* Título da Página */}
      <Header
        title="Dashboard Financeiro"
        text="Visão geral da situação financeira da empresa"
      />

      {/* Cards Superiores de Status Geral */}
      <CardsStatusFinance totalSalesPedding={totalSalesPedding ?? 0} />

      {/* Grid: Resumo de Vendas e Painel de Alertas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <SalesSummaryCard
          salesSummaryData={
            salesSummaryData ?? {
              current_month_st: 0,
              last_month_st: 0,
              growth_percentage: 0,
            }
          }
        />
        <AlertsCard announcements={announcements ?? []} />
      </div>

      {/* Grid: Seção de Gráficos Analíticos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CashFlowChart cashFlow={cashFlow ?? []} />
        <TopProductsChart topProducts={topProducts ?? []} />
      </div>

      {/* Grid: Distribuição, Inventário e Pendências Financeiras */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <PaymentMethodsChart paymentMethodsStats={paymentMethodsStats ?? []} />
        <StockValueCard
          totalValueInStock={
            totalValueInStock ?? {
              cost_total: 0,
            }
          }
          inventoryTurnover={
            inventoryTurnover ?? {
              inventory_turnover: 0,
            }
          }
        />
        <AccountsPayableCard
          billsPayableSummary={
            billsPayableSummary ?? {
              general_status: "",
              total_overdue: 0,
              total_quantity: 0,
              total_scheduled: 0,
              total_to_pay: 0,
            }
          }
        />
      </div>
    </div>
  );
}
