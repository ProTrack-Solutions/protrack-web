export type PurchaseOrderStatus =
  | "draft"
  | "sent"
  | "partial"
  | "received"
  | "closed"
  | "canceled";

export interface PurchaseOrderItemParams {
  product_id: string;
  quantity: number;
  unit_cost: number;
}

export interface SavePurchaseOrderParams {
  vendor_id: string;
  expected_date?: string; // YYYY-MM-DD
  notes?: string;
  items: PurchaseOrderItemParams[];
  /** Só na criação: já marca o pedido como enviado ao fornecedor */
  send?: boolean;
}

export interface ListPurchaseOrdersParams {
  status?: PurchaseOrderStatus;
  vendor_id?: string;
  search?: string;
  page?: number;
  per_page?: number;
}

export interface PurchaseOrderListItem {
  id: string;
  number: number;
  vendor_name: string;
  status: PurchaseOrderStatus;
  expected_date: string | null;
  created_at: string;
  items_count: number;
  total: number;
  quantity: number;
  received_quantity: number;
  received_total: number;
  late: boolean;
}

export interface PurchasesOverview {
  pending_total: number;
  received_this_month: number;
  late_orders: number;
  count_by_status: Partial<Record<PurchaseOrderStatus, number>>;
}

export interface ListPurchaseOrdersResponse {
  data: PurchaseOrderListItem[];
  page: number;
  per_page: number;
  total_rows: number;
  total_pages: number;
  overview: PurchasesOverview;
}

export interface PurchaseOrderItem {
  id: string;
  product_id: string;
  product_name: string;
  /** Vazio quando o produto não foi criado por grade */
  model_name: string;
  color: string;
  size: string;
  barcode: string;
  unit: string;
  sell_in_bulk: boolean;
  stock_quantity: number;
  current_cost: number;
  sale_price: number;
  quantity: number;
  unit_cost: number;
  total: number;
  received_quantity: number;
  pending_quantity: number;
}

export interface PurchaseReceiptItem {
  order_item_id: string;
  product_id: string;
  product_name: string;
  quantity: number;
  unit_cost: number;
  landed_unit_cost: number;
  previous_cost: number;
  new_cost: number;
}

export type PurchaseBillStatus =
  | "pending"
  | "paid"
  | "overdue"
  | "scheduled"
  | "canceled"
  | "partial";

export interface PurchaseReceiptBill {
  id: string;
  description: string;
  amount: number;
  due_date: string;
  status: PurchaseBillStatus;
  amount_paid: number;
  payment_date: string | null;
}

export interface PurchaseReceipt {
  id: string;
  status: "active" | "reversed";
  received_at: string;
  invoice_number: string;
  invoice_series: string;
  invoice_key: string;
  items_total: number;
  freight: number;
  other_expenses: number;
  discount: number;
  total: number;
  notes: string | null;
  created_by_name: string;
  reversed_at: string | null;
  reversed_by_name: string;
  reversal_reason: string | null;
  items: PurchaseReceiptItem[];
  bills: PurchaseReceiptBill[];
}

export interface PurchaseOrderDetail {
  id: string;
  number: number;
  vendor_id: string;
  vendor_name: string;
  status: PurchaseOrderStatus;
  expected_date: string | null;
  notes: string | null;
  created_by_name: string;
  created_at: string;
  updated_at: string;
  sent_at: string | null;
  closed_at: string | null;
  close_reason: string | null;
  total: number;
  received_total: number;
  quantity: number;
  received_quantity: number;
  items: PurchaseOrderItem[];
  receipts: PurchaseReceipt[];
  /** E-mail cadastrado do fornecedor; vazio quando não há */
  vendor_email: string;
  /** Últimos e-mails do pedido enviados ao fornecedor */
  emails: PurchaseOrderEmail[];
  can_edit: boolean;
  can_send: boolean;
  can_receive: boolean;
  can_close: boolean;
  can_cancel: boolean;
  can_email: boolean;
}

/** sent: pedido enviado · updated: pedido alterado · resend: reenvio manual */
export type PurchaseEmailKind = "sent" | "updated" | "resend";

export interface PurchaseOrderEmail {
  kind: PurchaseEmailKind;
  recipient: string;
  sent_by_name: string;
  created_at: string;
}

export interface ReceiveItemParams {
  order_item_id: string;
  quantity: number;
  unit_cost: number;
  /** Omitido mantém o preço de venda atual */
  sale_price?: number;
}

export interface InstallmentParams {
  due_date: string; // YYYY-MM-DD
  amount: number;
}

export interface ReceivePurchaseParams {
  received_at?: string; // YYYY-MM-DD
  invoice_number?: string;
  invoice_series?: string;
  invoice_key?: string;
  freight: number;
  other_expenses: number;
  discount: number;
  notes?: string;
  items: ReceiveItemParams[];
  installments: InstallmentParams[];
  bill_category_id?: string;
  payment_method_id?: string;
}

// ─── Catálogo (busca e cadastro rápido dentro de Compras) ───────────────────

export interface CatalogProduct {
  id: string;
  name: string;
  model_name: string;
  color: string;
  size: string;
  barcode: string;
  unit: string;
  sell_in_bulk: boolean;
  quantity: number;
  cost_price: number;
  sale_price: number;
}

export interface CatalogModel {
  model_name: string;
  variations: number;
}

export interface CatalogSearchResponse {
  products: CatalogProduct[];
  /** Modelos de grade que casam com a busca (atalho de recompra) */
  models: CatalogModel[];
  page: number;
  per_page: number;
  total_rows: number;
  total_pages: number;
}

export interface CatalogCategory {
  id: string;
  name: string;
}

export interface VariationParams {
  color: string;
  size: string;
  /** Omitidos usam o custo/preço do modelo */
  cost_price?: number;
  sale_price?: number;
}

export interface CreateVariationsParams {
  model_name: string;
  category_id: string;
  description?: string;
  cost_price: number;
  sale_price: number;
  variations: VariationParams[];
}
