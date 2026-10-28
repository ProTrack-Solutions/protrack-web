export type ReturnKind = "return" | "exchange";
export type ReturnDestination = "credit" | "refund";
export type ReturnReason = "size" | "defect" | "regret" | "wrong_item" | "other";
/** Formas de devolver dinheiro ou receber a diferença da troca */
export type RefundMethod =
  | "cash"
  | "pix"
  | "credit_card"
  | "debit_card"
  | "bank_transfer"
  | "other";

export interface ReturnableItem {
  sale_item_id: string;
  product_id: string;
  product_name: string;
  sell_in_bulk: boolean;
  quantity: number;
  unit_price: number;
  /** Valor pago por unidade, já com o desconto da venda */
  unit_amount: number;
  returned_quantity: number;
  available: number;
  /** Valor pago pela linha e quanto dele já foi devolvido */
  net_total: number;
  returned_total: number;
}

export interface PreviousReturn {
  id: string;
  number: number;
  kind: ReturnKind;
  returned_total: number;
  created_at: string;
}

export interface ReturnableSale {
  sale_id: string;
  customer_id: string | null;
  customer_name: string;
  customer_credit: number;
  payment_method: string;
  status: string;
  subtotal: number;
  discount_amount: number;
  total_amount: number;
  created_at: string;
  canceled: boolean;
  /** Saldo das parcelas em aberto: a devolução abate daqui primeiro */
  open_debt: number;
  /** 0 = sem prazo */
  window_days: number;
  deadline: string | null;
  within_window: boolean;
  can_override: boolean;
  items: ReturnableItem[];
  previous_returns: PreviousReturn[];
}

export interface SaleSearchItem {
  id: string;
  created_at: string;
  total_amount: number;
  payment_method: string;
  customer_name: string;
  items_count: number;
  returned_count: number;
  products: string;
}

export interface SaleSearchResponse {
  data: SaleSearchItem[];
  page: number;
  per_page: number;
  total: number;
}

export interface CreateReturnParams {
  sale_id: string;
  kind: ReturnKind;
  items: { sale_item_id: string; quantity: number; restock?: boolean }[];
  new_items?: { product_id: string; quantity: number }[];
  destination?: ReturnDestination;
  refund_method?: RefundMethod;
  customer_id?: string;
  difference_method?: RefundMethod;
  amount_received?: number;
  reason: ReturnReason;
  notes?: string;
  override_reason?: string;
}

export interface ReturnListItem {
  id: string;
  number: number;
  kind: ReturnKind;
  sale_id: string;
  exchange_sale_id: string | null;
  customer_id: string | null;
  customer_name: string;
  returned_total: number;
  exchange_total: number;
  debt_reduction: number;
  credit_amount: number;
  refund_amount: number;
  refund_method: RefundMethod | null;
  difference_paid: number;
  reason: ReturnReason;
  out_of_window: boolean;
  items_count: number;
  created_at: string;
  created_by_name: string;
}

export interface ListReturnsParams {
  page?: number;
  per_page?: number;
  search?: string;
  kind?: ReturnKind;
  start_date?: string;
  end_date?: string;
}

export interface ListReturnsResponse {
  data: ReturnListItem[];
  page: number;
  per_page: number;
  total: number;
}

export interface ReturnDetail extends ReturnListItem {
  exchange_credit: number;
  difference_method: RefundMethod | null;
  notes: string | null;
  override_reason: string | null;
  sale_created_at: string;
  sale_total: number;
  items: {
    product_id: string;
    product_name: string;
    quantity: number;
    unit_amount: number;
    total: number;
    restock: boolean;
  }[];
  new_items: {
    product_id: string;
    product_name: string;
    quantity: number;
    unit_price: number;
    total: number;
  }[];
}

export interface CreditMovement {
  id: string;
  type: "return" | "sale" | "sale_cancel";
  amount: number;
  balance_after: number;
  sale_return_id: string | null;
  return_number: number | null;
  sale_id: string | null;
  created_at: string;
  created_by_name: string;
}

export interface CustomerCredit {
  customer_id: string;
  customer_name: string;
  store_credit: number;
  movements: CreditMovement[];
}
