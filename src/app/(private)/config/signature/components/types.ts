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
