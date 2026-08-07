export type PlanoId = "starter" | "profissional" | "business";

export interface Plano {
  id: PlanoId;
  nome: string;
  preco: number;
  descricao: string;
  destaque?: boolean;
  recursos: string[];
}

export const planos: Plano[] = [
  {
    id: "starter",
    nome: "Starter",
    preco: 79.9,
    descricao: "Para quem está começando a organizar a operação.",
    recursos: [
      "Até 3 usuários",
      "1.000 produtos",
      "Relatórios básicos",
      "Suporte por e-mail",
    ],
  },
  {
    id: "profissional",
    nome: "Profissional",
    preco: 149.9,
    descricao: "O equilíbrio ideal entre recursos e preço.",
    destaque: true,
    recursos: [
      "Até 10 usuários",
      "Produtos ilimitados",
      "Financeiro completo",
      "Integração WhatsApp",
      "Suporte prioritário",
    ],
  },
  {
    id: "business",
    nome: "Business",
    preco: 299.9,
    descricao: "Para operações que precisam de escala e controle.",
    recursos: [
      "Usuários ilimitados",
      "Multi-empresas",
      "API e integrações",
      "Relatórios avançados",
      "Gerente de conta dedicado",
    ],
  },
];

export interface Fatura {
  id: string;
  numero: string;
  data: string;
  vencimento: string;
  valor: number;
  status: "paga" | "pendente" | "falhou";
  metodo: string;
}

export const faturas: Fatura[] = [
  {
    id: "1",
    numero: "FAT-2026-008",
    data: "01/08/2026",
    vencimento: "05/08/2026",
    valor: 149.9,
    status: "pendente",
    metodo: "Mastercard •••• 0000",
  },
  {
    id: "2",
    numero: "FAT-2026-007",
    data: "01/07/2026",
    vencimento: "05/07/2026",
    valor: 149.9,
    status: "paga",
    metodo: "Mastercard •••• 0000",
  },
  {
    id: "3",
    numero: "FAT-2026-006",
    data: "01/06/2026",
    vencimento: "05/06/2026",
    valor: 149.9,
    status: "paga",
    metodo: "Mastercard •••• 0000",
  },
  {
    id: "4",
    numero: "FAT-2026-005",
    data: "01/05/2026",
    vencimento: "05/05/2026",
    valor: 149.9,
    status: "falhou",
    metodo: "Mastercard •••• 0000",
  },
  {
    id: "5",
    numero: "FAT-2026-004",
    data: "01/04/2026",
    vencimento: "05/04/2026",
    valor: 79.9,
    status: "paga",
    metodo: "Pix",
  },
  {
    id: "6",
    numero: "FAT-2026-003",
    data: "01/03/2026",
    vencimento: "05/03/2026",
    valor: 79.9,
    status: "paga",
    metodo: "Pix",
  },
];

export const brl = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
