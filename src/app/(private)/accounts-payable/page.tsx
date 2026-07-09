"use client";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ContasPagarTable } from "./components/ContasTable";
import {
  useContasPagar,
  CATEGORIAS_CONTAS_PAGAR,
} from "@/hooks/useAccountsPayable";
import { ContasPagarFiltrosPesquisa } from "./components/FiltrosPesquisa";
import { ContasPagarResumoCards } from "./components/ResumoCards";
import { useRouter } from "next/navigation";

export interface ContaPagar {
  id: string;
  fornecedor: string;
  valor: number;
  dataVencimento: string;
  diasAtraso: number;
  status: "pendente" | "pago" | "vencido" | "agendado";
  categoria: string;
  descricao: string;
  dataAgendamento?: string;
}

export default function AccountsPayable() {
  const route = useRouter();
  const {
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    categoriaFilter,
    setCategoriaFilter,
    filteredContas,
    totalPendente,
    totalVencido,
    totalAgendado,
    handleMarcarPago,
    handleGerarPagamento,
    handleAgendarPagamento,
  } = useContasPagar();

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
        <Button onClick={() => route.push("/contas-pagar/cadastro")}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Conta
        </Button>
      </div>

      <ContasPagarResumoCards
        totalPendente={totalPendente}
        totalVencido={totalVencido}
        totalAgendado={totalAgendado}
        totalContas={filteredContas.length}
      />

      <ContasPagarFiltrosPesquisa
        searchTerm={searchTerm}
        onSearchTermChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        categoriaFilter={categoriaFilter}
        onCategoriaFilterChange={setCategoriaFilter}
        categorias={CATEGORIAS_CONTAS_PAGAR}
      />

      <ContasPagarTable
        contas={filteredContas}
        onMarcarPago={handleMarcarPago}
        onAgendarPagamento={handleAgendarPagamento}
        onGerarPagamento={handleGerarPagamento}
      />
    </div>
  );
}
