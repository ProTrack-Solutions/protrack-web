import {
  RefundMethod,
  ReturnKind,
  ReturnReason,
} from "@/interfaces/returns.interface";

export {
  formatDateTime,
  money,
} from "../../purchases/components/format";

/** Data local de um instante (ISO com hora) */
export const formatDay = (iso: string | null | undefined) =>
  iso ? new Date(iso).toLocaleDateString("pt-BR") : "—";

export const REASONS: { value: ReturnReason; label: string }[] = [
  { value: "size", label: "Tamanho / numeração" },
  { value: "defect", label: "Defeito" },
  { value: "regret", label: "Desistência" },
  { value: "wrong_item", label: "Produto errado" },
  { value: "other", label: "Outro" },
];

export const reasonLabel = (reason: ReturnReason) =>
  REASONS.find((r) => r.value === reason)?.label ?? reason;

export const REFUND_METHODS: { value: RefundMethod; label: string }[] = [
  { value: "cash", label: "Dinheiro" },
  { value: "pix", label: "Pix" },
  { value: "debit_card", label: "Cartão de débito" },
  { value: "credit_card", label: "Cartão de crédito" },
  { value: "bank_transfer", label: "Transferência" },
  { value: "other", label: "Outro" },
];

export const methodLabel = (method: string | null | undefined) =>
  REFUND_METHODS.find((m) => m.value === method)?.label ?? "—";

export const KIND: Record<ReturnKind, { label: string; className: string }> = {
  return: {
    label: "Devolução",
    className:
      "bg-amber-100 text-amber-900 ring-1 ring-inset ring-amber-300 dark:bg-amber-500/15 dark:text-amber-300 dark:ring-amber-500/30",
  },
  exchange: {
    label: "Troca",
    className:
      "bg-blue-100 text-blue-800 ring-1 ring-inset ring-blue-200 dark:bg-blue-500/15 dark:text-blue-300 dark:ring-blue-500/30",
  },
};

const cents = (v: number) => Math.round(v * 100);

/**
 * Valor devolvido ao devolver qty unidades de uma linha (mesma regra do
 * servidor): fechando a linha, devolve exatamente o que faltava.
 */
export function lineReturnAmount(
  netTotal: number,
  returnedTotal: number,
  quantity: number,
  returnedQty: number,
  qty: number,
) {
  if (qty <= 0) return 0;
  if (returnedQty + qty >= quantity) {
    return Math.max(cents(netTotal - returnedTotal), 0) / 100;
  }
  return cents((netTotal / quantity) * qty) / 100;
}

/**
 * Distribui o valor devolvido: cobre os itens novos da troca, depois abate as
 * parcelas em aberto e o resto vira vale-troca ou dinheiro de volta.
 */
export function allocate(returned: number, exchangeTotal: number, openDebt: number) {
  const r = cents(returned);
  const n = cents(exchangeTotal);
  const d = Math.max(cents(openDebt), 0);
  const used = Math.min(r, n);
  const leftover = r - used;
  const debt = Math.min(leftover, d);
  return {
    exchangeCredit: used / 100,
    difference: (n - used) / 100,
    debtReduction: debt / 100,
    rest: (leftover - debt) / 100,
  };
}
