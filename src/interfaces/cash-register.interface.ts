export type CashSessionStatus = "open" | "closed";
export type CashMovementType = "withdrawal" | "supply";

export interface CashSession {
  id: string;
  user_id: string;
  user_name?: string;
  status: CashSessionStatus;
  opening_amount: number;
  opening_notes: string | null;
  opened_at: string;
  closed_at: string | null;
  closing_notes: string | null;
  // Retrato gravado no fechamento; nulos enquanto o caixa está aberto
  sales_total: number | null;
  sales_count: number | null;
  received_total: number | null;
  expected_cash: number | null;
  counted_cash: number | null;
  difference: number | null;
}

export interface CashMovement {
  id: string;
  type: CashMovementType;
  amount: number;
  reason: string | null;
  created_at: string;
}

export interface CashMethodSummary {
  payment_method: string;
  sales_count: number;
  sales_total: number;
  receipts_count: number;
  receipts_total: number;
  /** O que de fato entrou: na venda a prazo, só a entrada (já sem reembolsos) */
  received: number;
  /** Devolvido a clientes em trocas/devoluções nesta forma */
  refunds_count?: number;
  refunds_total?: number;
}

export interface CashSummary {
  sales_count: number;
  sales_total: number;
  receipts_count: number;
  receipts_total: number;
  received_total: number;
  /** Dinheiro em espécie: vendas, entradas de vendas a prazo e parcelas */
  cash_received: number;
  supplies_total: number;
  withdrawals_total: number;
  /** Devolvido a clientes em trocas/devoluções do turno */
  refunds_count?: number;
  refunds_total?: number;
  /** Parte em dinheiro dos reembolsos (sai da gaveta) */
  cash_refunds?: number;
  expected_cash: number;
  /** Troco devolvido no turno, já descontado de cash_received */
  change_count: number;
  change_total: number;
  by_method: CashMethodSummary[];
}

export interface CashSessionDetail {
  session: CashSession;
  summary: CashSummary;
  movements: CashMovement[];
}

/** /current devolve `{ session: null }` quando o caixa está fechado */
export type CurrentCashSessionResponse =
  | CashSessionDetail
  | { session: null; summary?: undefined; movements?: undefined };

export interface OpenCashSessionParams {
  opening_amount: number;
  notes?: string;
}

export interface CreateCashMovementParams {
  type: CashMovementType;
  amount: number;
  reason?: string;
}

export interface CloseCashSessionParams {
  counted_cash: number;
  notes?: string;
}

export interface ListCashSessionsResponse {
  data: CashSession[];
  page: number;
  per_page: number;
  total_rows: number;
  total_pages: number;
}
