"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { toast } from "sonner";

import { PaymentMethodsCard } from "./components/PaymentMethodsCard";
import { CategoriesCard } from "./components/CategoriesCard";
import { LimitsCard, LimitsData } from "./components/LimitsCard";
import { AlertsCard, AlertsData } from "./components/AlertsCard";
import { useBillsCategories } from "@/hooks/useBillsCategories";
import { HeaderConfig } from "@/components/HeaderConfig";

export default function FinancialConfigPage() {
  const { billsCategories } = useBillsCategories();

  const [alerts, setAlerts] = useState<AlertsData>({
    contasVencidas: true,
    estoqueMinimo: true,
    fluxoCaixaNegativo: true,
    metaVendas: false,
    limiteCredito: true,
  });

  const [limits, setLimits] = useState<LimitsData>({
    limiteDiario: 5000,
    limiteSemanal: 25000,
    limiteMensal: 100000,
    alertaFluxoCaixa: 10000,
  });

  const handleSaveSettings = () =>
    toast("As configurações financeiras foram atualizadas com sucesso.");

  return (
    <div className="space-y-6">
      <HeaderConfig
        title="Configurações Financeiras"
        description="Configure contas, métodos de pagamento, categorias e alertas"
      />

      <PaymentMethodsCard />

      <CategoriesCard categories={billsCategories ?? []} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LimitsCard values={limits} onChange={setLimits} />
        <AlertsCard alerts={alerts} onChange={setAlerts} />
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSaveSettings} className="bg-gradient-primary">
          <Save className="h-4 w-4 mr-2" /> Salvar Todas as Configurações
        </Button>
      </div>
    </div>
  );
}
