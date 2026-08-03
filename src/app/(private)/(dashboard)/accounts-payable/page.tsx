"use client";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ContasPagarTable } from "./components/ContasTable";
import { ContasPagarFiltrosPesquisa } from "./components/FiltrosPesquisa";
import { ContasPagarResumoCards } from "./components/ResumoCards";
import { useBillsPayable } from "@/hooks/useBillsPayable";
import { Loading } from "@/components/Loading";
import { DialogNewAccountsPayable } from "@/components/DialogAccountsPayable";
import { useState } from "react";

export default function AccountsPayable() {
  const {
    billsPayable,
    billsPayableCount,
    loading,
    totalOverdue,
    totalPayable,
    totalScheduled,
  } = useBillsPayable();

  console.log("billsPayable", billsPayable);

  const [newOpenDialog, setNewOpenDialog] = useState(false);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Contas a Pagar
          </h1>
          <p className="text-muted-foreground">
            Gerencie as contas e pagamentos a fornecedores
          </p>
        </div>
        <Button
          onClick={() => setNewOpenDialog(true)}
          className="cursor-pointer"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nova Conta
        </Button>
      </div>

      <ContasPagarResumoCards
        totalPendente={totalPayable}
        totalVencido={totalOverdue}
        totalAgendado={totalScheduled}
        totalContas={billsPayableCount}
      />

      <ContasPagarFiltrosPesquisa
        searchTerm={""}
        onSearchTermChange={() => {}}
        statusFilter={""}
        onStatusFilterChange={() => {}}
        categoriaFilter={""}
        onCategoriaFilterChange={() => {}}
        categorias={[]}
      />

      <ContasPagarTable
        contas={billsPayable}
        onAgendarPagamento={() => {}}
        onGerarPagamento={() => {}}
      />

      <DialogNewAccountsPayable
        open={newOpenDialog}
        onOpenChange={setNewOpenDialog}
      />
    </div>
  );
}
