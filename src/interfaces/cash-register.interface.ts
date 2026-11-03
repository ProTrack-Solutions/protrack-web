export type CashSessionStatus = "open" | "closed";
export type CashMovementType = "withdrawal" | "supply";

/** Caixa físico da empresa ("Caixa 1", "Balcão") */
export interface CashRegister {
  id: string;
  name: string;
  active: boolean;
  /** Turno aberto agora; nulo quando o caixa está fechado */
  open_session: {
    id: string;
    opened_at: string;
    opening_amount: number;
    opened_by_name: string;
  } | null;
  /** Último fechamento: referência para o troco da próxima abertura */
  last_closing: {
    closed_at: string;
    closed_by_name: string;
    counted_cash: number;
  } | null;
}

export interface SaveCashRegisterParams {
  name: string;
  active?: boolean;
}

export interface CashSession {
  id: string;
  register_id: string;
  register_name?: string;
  /** Quem abriu o turno */
  user_id: string;
  user_name?: string;
  closed_by_name?: string;
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
  created_by_name: string;
  /** Preenchido quando o movimento veio de uma transferência entre caixas */
  transfer_label?: string;
  created_at: string;
}

/** Transferência de troco aguardando o caixa de destino aceitar */
export interface PendingCashTransfer {
  id: string;
  amount: number;
  reason: string | null;
  from_register_name: string;
  to_register_name: string;
  created_by_name: string;
  created_at: string;
}

export interface CreateCashTransferParams {
  to_register_id: string;
  amount: number;
  reason?: string;
}

export type CashTransferAction = "accept" | "reject" | "cancel";

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

/** Quanto cada operador vendeu e recebeu de parcelas no turno */
export interface CashOperatorSummary {
  user_id: string;
  user_name: string;
  sales_count: number;
  sales_total: number;
  receipts_total: number;
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
  by_operator: CashOperatorSummary[];
}

export interface CashSessionDetail {
  session: CashSession;
  summary: CashSummary;
  movements: CashMovement[];
  /** Chegando neste caixa: alguém daqui aceita ou recusa */
  incoming_transfers: PendingCashTransfer[];
  /** Saindo deste caixa: aguardando o destino; dá para cancelar */
  outgoing_transfers: PendingCashTransfer[];
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
