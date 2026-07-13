"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { toast } from "sonner";
import { BankAccount, BankAccountsCard } from "./components/BankAccountsCard";
import {
  PaymentMethod,
  PaymentMethodsCard,
} from "./components/PaymentMethodsCard";
import { CategoriesCard } from "./components/CategoriesCard";
import { LimitsCard, LimitsData } from "./components/LimitsCard";
import { AlertsCard, AlertsData } from "./components/AlertsCard";
import { useBillsCategories } from "@/hooks/useBillsCategories";

export default function FinancialConfigPage() {
  const { billsCategories } = useBillsCategories();

  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([
    {
      id: "1",
      nome: "Conta Principal",
      banco: "Banco do Brasil",
      agencia: "1234-5",
      conta: "12345-6",
      saldo: 45200.3,
      ativa: true,
    },
    {
      id: "2",
      nome: "Conta Reserva",
      banco: "Banco Itaú",
      agencia: "5678-9",
      conta: "67890-1",
      saldo: 18500.5,
      ativa: true,
    },
  ]);

  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    { id: "1", nome: "Dinheiro", tipo: "dinheiro", ativo: true },
    { id: "2", nome: "Cartão de Débito", tipo: "cartao", ativo: true },
    { id: "3", nome: "Cartão de Crédito", tipo: "cartao", ativo: true },
    { id: "4", nome: "PIX", tipo: "pix", ativo: true },
    {
      id: "5",
      nome: "Transferência Bancária",
      tipo: "transferencia",
      ativo: false,
    },
  ]);

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
  const handleAddAccount = () =>
    toast("Funcionalidade para adicionar nova conta bancária.");
  const handleEditAccount = (id: string) =>
    toast(`Editando conta bancária ID: ${id}`);
  const handleAddCategory = () =>
    toast("Funcionalidade para adicionar nova categoria.");

  const handleDeleteAccount = (id: string) => {
    setBankAccounts((accounts) => accounts.filter((c) => c.id !== id));
    toast("A conta bancária foi removida com sucesso.");
  };

  const handleToggleMethod = (id: string) => {
    setPaymentMethods((methods) =>
      methods.map((m) => (m.id === id ? { ...m, ativo: !m.ativo } : m)),
    );
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Configurações Financeiras
        </h1>
        <p className="text-muted-foreground">
          Configure contas, métodos de pagamento, categorias e alertas
        </p>
      </div>

      <BankAccountsCard
        accounts={bankAccounts}
        onAdd={handleAddAccount}
        onEdit={handleEditAccount}
        onDelete={handleDeleteAccount}
      />

      <PaymentMethodsCard
        methods={paymentMethods}
        onToggle={handleToggleMethod}
      />

      <CategoriesCard
        categories={billsCategories ?? []}
        onAdd={handleAddCategory}
      />

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
