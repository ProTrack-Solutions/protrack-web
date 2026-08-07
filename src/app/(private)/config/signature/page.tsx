"use client";

import { useMemo, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { BillingInfoCard } from "./components/BillingInfoCard";
import { CancelSubscriptionDialog } from "./components/CancelSubscriptionDialog";
import { ChangePlanDialog } from "./components/ChangePlanDialog";
import { CurrentPlanCard } from "./components/CurrentPlanCard";
import { NextInvoiceCard } from "./components/NextInvoiceCard";
import { PaymentHistoryTable } from "./components/PaymentHistoryTable";
import { PaymentMethodCard } from "./components/PaymentMethodCard";
import { PlansGrid } from "./components/PlansGrid";
import { SignatureStats } from "./components/SignatureStats";
import { faturas, Plano, PlanoId, planos } from "./components/types";
import { HeaderConfig } from "@/components/HeaderConfig";

const Assinatura = () => {
  const [planoAtual, setPlanoAtual] = useState<PlanoId>("profissional");
  const [cancelado, setCancelado] = useState(false);
  const [confirmCancel, setConfirmCancel] = useState(false);
  const [planoSelecionado, setPlanoSelecionado] = useState<Plano | null>(null);

  const plano = useMemo(
    () => planos.find((p) => p.id === planoAtual)!,
    [planoAtual],
  );

  const totalPago = faturas
    .filter((f) => f.status === "paga")
    .reduce((s, f) => s + f.valor, 0);

  const handleUpgrade = () =>
    setPlanoSelecionado(
      planos.find((p) => p.preco > plano.preco) ?? planos[planos.length - 1],
    );

  const confirmarTroca = () => {
    if (!planoSelecionado) return;
    const upgrade = planoSelecionado.preco > plano.preco;
    setPlanoAtual(planoSelecionado.id);
    setCancelado(false);
    toast(upgrade ? "Upgrade realizado!" : "Plano alterado");
    setPlanoSelecionado(null);
  };

  const cancelar = () => {
    setCancelado(true);
    setConfirmCancel(false);
    toast("Assinatura cancelada");
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-background via-background to-muted/30">
      <HeaderConfig
        title="Assinatura"
        description="Gerencie sua assinatura e faturas"
      />
      <SignatureStats
        plano={plano}
        cancelado={cancelado}
        totalPago={totalPago}
      />

      <Tabs defaultValue="visao" className="space-y-6 pt-4">
        <TabsList>
          <TabsTrigger value="visao">Visão geral</TabsTrigger>
          <TabsTrigger value="planos">Planos</TabsTrigger>
          <TabsTrigger value="faturamento">Faturamento</TabsTrigger>
          <TabsTrigger value="historico">Histórico</TabsTrigger>
        </TabsList>

        <TabsContent value="visao" className="space-y-6">
          <div className="grid lg:grid-cols-3 gap-6">
            <CurrentPlanCard
              plano={plano}
              cancelado={cancelado}
              onUpgrade={handleUpgrade}
              onCancel={() => setConfirmCancel(true)}
              onReactivate={() => setCancelado(false)}
            />
            <PaymentMethodCard />
          </div>
        </TabsContent>

        <TabsContent value="planos">
          <PlansGrid planoAtual={plano} onSelect={setPlanoSelecionado} />
        </TabsContent>

        <TabsContent value="faturamento" className="space-y-6">
          <div className="grid lg:grid-cols-3 gap-6">
            <NextInvoiceCard plano={plano} cancelado={cancelado} />
            <BillingInfoCard />
          </div>
        </TabsContent>

        <TabsContent value="historico">
          <PaymentHistoryTable />
        </TabsContent>
      </Tabs>

      <ChangePlanDialog
        planoAtual={plano}
        planoSelecionado={planoSelecionado}
        onOpenChange={(open) => !open && setPlanoSelecionado(null)}
        onConfirm={confirmarTroca}
      />

      <CancelSubscriptionDialog
        open={confirmCancel}
        planoNome={plano.nome}
        onOpenChange={setConfirmCancel}
        onConfirm={cancelar}
      />
    </div>
  );
};

export default Assinatura;
