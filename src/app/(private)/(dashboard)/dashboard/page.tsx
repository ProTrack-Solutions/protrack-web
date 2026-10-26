"use client";

import { DashboardHeader } from "./components/DashboardHeader";
import { KpiCards } from "./components/KpiCards";
import { SalesSummaryCard } from "./components/SalesSummaryCard";
import { AlertsCard } from "./components/AlertsCard";
import { CashFlowCard } from "./components/CashFlowCard";
import { TopProductsChart } from "./components/TopProductsChart";
import { PaymentMethodsChart } from "./components/PaymentMethodsChart";
import { StockValueCard } from "./components/StockValueCard";
import { AccountsPayableCard } from "./components/AccountsPayableCard";

// Cada card busca o próprio dado e mostra um skeleton enquanto carrega:
// a página aparece na hora, sem esperar o endpoint mais lento.
export default function DashBoard() {
  return (
    <div className="space-y-6 p-6">
      <DashboardHeader />

      <KpiCards />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <SalesSummaryCard />
        <AlertsCard />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <CashFlowCard />
        <TopProductsChart />
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <PaymentMethodsChart />
        <StockValueCard />
        <AccountsPayableCard />
      </div>
    </div>
  );
}
