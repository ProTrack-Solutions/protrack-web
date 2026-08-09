"use client";

import { useEffect, useState } from "react";
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
import { HeaderConfig } from "@/components/HeaderConfig";
import { CancelSubiscription } from "@/service/subscription-manager.service";
import { useSubscription } from "@/hooks/useSubscription";
import { usePlans } from "@/hooks/usePlans";
import { useInvoiceHistory } from "@/hooks/useInvoiceHistory";
import { PlansResponse } from "@/interfaces/plans.interface";
import { SimpleLoading } from "@/components/SimpleLoading";
import { useCompany } from "@/hooks/useCompany";

const PLANO_VAZIO: PlansResponse = {
  id: "",
  name: "",
  description: "",
  price_cents: 0,
  currency: "BRL",
  billing_cycle: "",
  active: false,
  created_at: new Date(),
  updated_at: new Date(),
  external_id: "",
  highlight: false,
  icon: "",
  features: [],
};

const Assinatura = () => {
  const {
    subscription,
    error: subscriptionError,
    loading: subscriptionLoading,
    refetch,
  } = useSubscription();
  const { plans, loading: plansLoading } = usePlans();

  const { company, loading: companyLoading } = useCompany();

  // PerPage alto o suficiente para cobrir o histórico recente sem paginação:
  // a mesma lista alimenta tanto a tabela da aba "Histórico" quanto o total
  // pago exibido em SignatureStats.
  const { invoices, loading: invoicesLoading } = useInvoiceHistory({
    Page: 1,
    PerPage: 50,
  });

  const [confirmCancel, setConfirmCancel] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [planoSelecionado, setPlanoSelecionado] =
    useState<PlansResponse | null>(null);

  useEffect(() => {
    if (subscriptionError) toast.error(subscriptionError);
  }, [subscriptionError]);

  // Monta o plano exibido a partir da própria assinatura (não do catálogo),
  // já que um plano descontinuado pode não aparecer mais em /plans.
  const plano: PlansResponse = subscription
    ? {
        id: subscription.plan.id,
        name: subscription.plan.name,
        description: subscription.plan.description,
        price_cents: subscription.plan.price_cents,
        currency: subscription.plan.currency,
        billing_cycle: subscription.plan.billing_cycle,
        active: subscription.plan.active,
        created_at: new Date(subscription.created_at),
        updated_at: new Date(subscription.updated_at),
        external_id: subscription.plan.external_id,
        highlight: subscription.plan.highlight,
        icon: subscription.plan.icon,
        features: subscription.features.map((f) => ({
          id: f.id,
          name: f.name,
          is_enabled: f.is_enabled,
          display_order: f.display_order,
          created_at: subscription.created_at,
          updated_at: subscription.updated_at,
          plan_id: subscription.plan.id,
        })),
      }
    : PLANO_VAZIO;

  const proximaCobranca = subscription
    ? new Date(subscription.current_period_end).toLocaleDateString("pt-BR")
    : "—";

  const totalPago =
    invoices
      .filter((f) => f.status === "approved")
      .reduce((s, f) => s + f.amount_cents, 0) / 100;

  const handleUpgrade = () => {
    if (!plans?.length) return;
    setPlanoSelecionado(
      plans.find((p) => p.price_cents > plano.price_cents) ??
        plans[plans.length - 1],
    );
  };

  const confirmarTroca = () => {
    if (!planoSelecionado) return;
    const upgrade = planoSelecionado.price_cents > plano.price_cents;
    toast(upgrade ? "Upgrade realizado!" : "Plano alterado");
    setPlanoSelecionado(null);
  };

  const cancelar = async (motivo: string, cancelarImediatamente: boolean) => {
    setIsCancelling(true);
    try {
      await CancelSubiscription({
        cancel_at_period_end: !cancelarImediatamente,
        idempotency_key: crypto.randomUUID(),
        reason: motivo,
      });
      setConfirmCancel(false);
      refetch();
      toast.success(
        cancelarImediatamente
          ? "Assinatura cancelada imediatamente"
          : "Assinatura cancelada",
      );
    } catch (error) {
      console.log(error);
      toast.error("Erro ao cancelar assinatura!");
    } finally {
      setIsCancelling(false);
    }
  };

  if (subscriptionLoading || plansLoading || companyLoading || !company) {
    return <SimpleLoading fullScreen />;
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-background via-background to-muted/30">
      <HeaderConfig
        title="Assinatura"
        description="Gerencie sua assinatura e faturas"
      />
      <SignatureStats
        plano={plano}
        status={subscription?.status ?? ""}
        totalPago={totalPago}
        proximaCobranca={proximaCobranca}
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
              status={subscription?.status ?? ""}
              proximaCobranca={proximaCobranca}
              onUpgrade={handleUpgrade}
              onCancel={() => setConfirmCancel(true)}
              onReactivate={() => {}}
            />
            <PaymentMethodCard paymentMethod={subscription?.payment_method} />
          </div>
        </TabsContent>

        <TabsContent value="planos">
          <PlansGrid planoAtual={plano} onSelect={setPlanoSelecionado} />
        </TabsContent>

        <TabsContent value="faturamento" className="space-y-6">
          <div className="grid lg:grid-cols-3 gap-6">
            <NextInvoiceCard
              plano={plano}
              status={subscription?.status ?? ""}
              proximaCobranca={proximaCobranca}
            />
            <BillingInfoCard company={company} />
          </div>
        </TabsContent>

        <TabsContent value="historico">
          <PaymentHistoryTable
            invoices={invoices}
            loading={invoicesLoading}
            paymentMethod={subscription?.payment_method}
          />
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
        planoNome={plano.name}
        proximaCobranca={proximaCobranca}
        isSubmitting={isCancelling}
        onOpenChange={setConfirmCancel}
        onConfirm={cancelar}
      />
    </div>
  );
};

export default Assinatura;
