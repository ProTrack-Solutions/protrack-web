import { ContaPagar } from "@/app/(private)/accounts-payable/page";
import { useMemo, useState } from "react";
import { toast } from "sonner";

// TODO: substituir pelo consumo real da API (ex: TanStack Query) quando o
// endpoint de contas a pagar estiver disponível. Dados abaixo são fictícios,
// gerados apenas para desenvolvimento e testes visuais da tela.
const CONTAS_MOCK: ContaPagar[] = [
  {
    id: "1",
    fornecedor: "Fornecedor ABC Ltda",
    valor: 3500.0,
    dataVencimento: "2025-06-15",
    diasAtraso: 23,
    status: "vencido",
    categoria: "Mercadoria",
    descricao: "Compra de estoque - lote 342",
  },
  {
    id: "2",
    fornecedor: "CEMIG Distribuição S.A.",
    valor: 850.75,
    dataVencimento: "2025-07-20",
    diasAtraso: 0,
    status: "pendente",
    categoria: "Utilidades",
    descricao: "Conta de energia elétrica",
  },
  {
    id: "3",
    fornecedor: "Vivo Empresas",
    valor: 419.9,
    dataVencimento: "2025-07-25",
    diasAtraso: 0,
    status: "agendado",
    categoria: "Tecnologia",
    descricao: "Internet fibra + telefonia",
    dataAgendamento: "2025-07-24",
  },
  {
    id: "4",
    fornecedor: "Distribuidora Nordeste XYZ",
    valor: 2800.5,
    dataVencimento: "2025-06-10",
    diasAtraso: 0,
    status: "pago",
    categoria: "Mercadoria",
    descricao: "Produtos para revenda - junho",
  },
  {
    id: "5",
    fornecedor: "Banco Itaú Consignado",
    valor: 1250.0,
    dataVencimento: "2025-07-30",
    diasAtraso: 0,
    status: "pendente",
    categoria: "Financeiro",
    descricao: "Parcela de financiamento de veículo",
  },
  {
    id: "6",
    fornecedor: "Papelaria Central Ltda",
    valor: 187.4,
    dataVencimento: "2025-06-28",
    diasAtraso: 10,
    status: "vencido",
    categoria: "Outros",
    descricao: "Material de escritório",
  },
  {
    id: "7",
    fornecedor: "AWS - Amazon Web Services",
    valor: 2340.18,
    dataVencimento: "2025-07-18",
    diasAtraso: 0,
    status: "pago",
    categoria: "Tecnologia",
    descricao: "Fatura de infraestrutura cloud - junho",
  },
  {
    id: "8",
    fornecedor: "Transportadora Veloz Cargas",
    valor: 4120.0,
    dataVencimento: "2025-08-05",
    diasAtraso: 0,
    status: "agendado",
    categoria: "Mercadoria",
    descricao: "Frete de mercadorias - contrato mensal",
    dataAgendamento: "2025-08-04",
  },
  {
    id: "9",
    fornecedor: "Sabesp",
    valor: 312.6,
    dataVencimento: "2025-07-22",
    diasAtraso: 0,
    status: "pendente",
    categoria: "Utilidades",
    descricao: "Conta de água e esgoto",
  },
  {
    id: "10",
    fornecedor: "Contabilidade Souza & Associados",
    valor: 980.0,
    dataVencimento: "2025-07-05",
    diasAtraso: 3,
    status: "vencido",
    categoria: "Financeiro",
    descricao: "Honorários contábeis - julho",
  },
  {
    id: "11",
    fornecedor: "Microsoft Brasil Ltda",
    valor: 1567.32,
    dataVencimento: "2025-07-15",
    diasAtraso: 0,
    status: "pago",
    categoria: "Tecnologia",
    descricao: "Licenças Microsoft 365 - anual",
  },
  {
    id: "12",
    fornecedor: "Gráfica Impressul",
    valor: 645.0,
    dataVencimento: "2025-08-10",
    diasAtraso: 0,
    status: "pendente",
    categoria: "Outros",
    descricao: "Impressão de material promocional",
  },
];

export const CATEGORIAS_CONTAS_PAGAR = [
  "Mercadoria",
  "Utilidades",
  "Tecnologia",
  "Financeiro",
  "Outros",
];

export function useContasPagar() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [categoriaFilter, setCategoriaFilter] = useState("todas");

  const contas = CONTAS_MOCK;

  const filteredContas = useMemo(() => {
    return contas.filter((conta) => {
      const matchesSearch =
        conta.fornecedor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        conta.descricao.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === "todos" || conta.status === statusFilter;
      const matchesCategoria =
        categoriaFilter === "todas" || conta.categoria === categoriaFilter;
      return matchesSearch && matchesStatus && matchesCategoria;
    });
  }, [contas, searchTerm, statusFilter, categoriaFilter]);

  const { totalPendente, totalVencido, totalAgendado } = useMemo(() => {
    return {
      totalPendente: filteredContas
        .filter((c) => c.status !== "pago")
        .reduce((total, conta) => total + conta.valor, 0),
      totalVencido: filteredContas
        .filter((c) => c.status === "vencido")
        .reduce((total, conta) => total + conta.valor, 0),
      totalAgendado: filteredContas
        .filter((c) => c.status === "agendado")
        .reduce((total, conta) => total + conta.valor, 0),
    };
  }, [filteredContas]);

  const handleMarcarPago = (contaId: string) => {
    toast("A conta foi marcada como paga com sucesso.");
  };

  const handleGerarPagamento = (contaId: string) => {
    toast("Comprovante de pagamento gerado com sucesso.");
  };

  const handleAgendarPagamento = (contaId: string) => {
    toast("O pagamento foi agendado com sucesso.");
  };

  return {
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
  };
}
