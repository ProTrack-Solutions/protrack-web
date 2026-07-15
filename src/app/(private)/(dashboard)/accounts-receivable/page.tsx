"use client";

import { useState, useMemo } from "react";
import { toast } from "sonner";
import { AccountsReceivableTable } from "./components/AccountsReceivableTable";
import { BillsFilters } from "./components/BillsFilters";
import { SummaryCard } from "./components/SummaryCard";

export type StatusConta = "pendente" | "parcial" | "pago" | "vencido";

export interface ContaReceber {
  id: string;
  cliente: string;
  valor: number;
  dataVencimento: string;
  diasAtraso: number;
  status: StatusConta;
  valorPago: number;
  descricao: string;
}

export const mockContasReceber: ContaReceber[] = [
  {
    id: "1",
    cliente: "João Silva",
    valor: 2500.5,
    dataVencimento: "2024-12-15",
    diasAtraso: 5,
    status: "vencido",
    valorPago: 0,
    descricao: "Venda #001",
  },
  {
    id: "2",
    cliente: "Maria Santos",
    valor: 1800.0,
    dataVencimento: "2024-12-20",
    diasAtraso: 0,
    status: "pendente",
    valorPago: 0,
    descricao: "Venda #002",
  },
  {
    id: "3",
    cliente: "Pedro Costa",
    valor: 3200.75,
    dataVencimento: "2024-12-10",
    diasAtraso: 10,
    status: "parcial",
    valorPago: 1600.0,
    descricao: "Venda #003",
  },
  {
    id: "4",
    cliente: "Ana Oliveira",
    valor: 950.0,
    dataVencimento: "2024-12-18",
    diasAtraso: 0,
    status: "pago",
    valorPago: 950.0,
    descricao: "Venda #004",
  },
  {
    id: "5",
    cliente: "Carlos Ferreira",
    valor: 4500.25,
    dataVencimento: "2024-12-25",
    diasAtraso: 0,
    status: "pendente",
    valorPago: 0,
    descricao: "Venda #005",
  },
];

export default function AccountsReceivable() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");

  const contas: ContaReceber[] = mockContasReceber;

  const filteredContas = useMemo(() => {
    return contas.filter((conta) => {
      const matchesSearch =
        conta.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
        conta.descricao.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === "todos" || conta.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [contas, searchTerm, statusFilter]);

  const totalPendente = useMemo(
    () =>
      filteredContas
        .filter((c) => c.status !== "pago")
        .reduce((total, conta) => total + (conta.valor - conta.valorPago), 0),
    [filteredContas],
  );

  const totalVencido = useMemo(
    () =>
      filteredContas
        .filter((c) => c.status === "vencido")
        .reduce((total, conta) => total + conta.valor, 0),
    [filteredContas],
  );

  const handleBaixarPagamento = (contaId: string) => {
    toast("O pagamento foi registrado com sucesso.");
  };

  const handleEnviarLembrete = (contaId: string) => {
    toast("Lembrete de pagamento enviado para o cliente.");
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Contas a Receber
        </h1>
        <p className="text-muted-foreground">
          Gerencie os valores a receber de clientes
        </p>
      </div>

      <SummaryCard
        totalPendente={totalPendente}
        totalVencido={totalVencido}
        totalContas={filteredContas.length}
      />

      <BillsFilters
        searchTerm={searchTerm}
        onSearchTermChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
      />

      <AccountsReceivableTable
        contas={filteredContas}
        onBaixarPagamento={handleBaixarPagamento}
        onEnviarLembrete={handleEnviarLembrete}
      />
    </div>
  );
}
