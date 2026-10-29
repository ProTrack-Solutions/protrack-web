import { SaleStatus } from "@/utils/statusSales";
import { PaymentMethod } from "@/enum/methodPayments";
import { Pagination } from "./pagination.interface";

export interface SalePaginationParams extends Pagination {
  saleStatus?:
    | "pending"
    | "paid"
    | "overdue"
    | "scheduled"
    | "canceled"
    | "partial";
  paymentMethod?:
    | "cash"
    | "credit_card"
    | "debit_card"
    | "pix"
    | "bank_transfer"
    | "installments"
    | "other"
    | "store_credit";
  paymentStartDate?: string; // formato: YYYY-MM-DD
  paymentEndDate?: string; // formato: YYYY-MM-DD
  saleStartDate?: string; // formato: YYYY-MM-DD
  saleEndDate?: string; // formato: YYYY-MM-DD
  sortBy?: "sale_at" | "created_at";
}

export const initialSaleFormData: CreateSaleParams = {
  customer_id: "",
  buyer_document: "",
  discount_amount: 0,
  due_days: 0,
  payment_method: PaymentMethod.Cash,
  installments_count: 0,
  items: [],
  prohibited: 0,
  credit_amount: 0,
};

export interface CreateSaleParams {
  customer_id?: string;
  buyer_document: string;
  discount_amount: number;
  due_days: number;
  payment_method: PaymentMethod;
  installments_count: number;
  items: CreateSaleItemParams[];
  prohibited: number;
  /** Dinheiro entregue pelo cliente (total à vista ou entrada); vazio = valor exato */
  amount_received?: number;
  /** Parte paga com o vale-troca do cliente */
  credit_amount?: number;
}

interface CreateSaleItemParams {
  product_id: string;
  quantity: number;
}

export interface UpdateSaleParams {
  /** Desconto em R$. Omitido mantém o desconto atual da venda. */
  discount_amount?: number;
  due_days: number;
  payment_method: PaymentMethod;
  installments_count: number;
  prohibited: number;
}

export interface ListSalesResponse {
  sale_id: string;
  sale_at: string;
  subtotal: number;
  discount_amount: number;
  total_amount: number;
  installments_count: number;
  payment_method: PaymentMethod;
  sale_status: SaleStatus;
  customer_id: string;
  customer_name: string;
  installment_total_amount: number;
  down_payments: number;
  /** Valor já devolvido em trocas/devoluções */
  returned_total: number;
  /** Venda criada por uma troca */
  is_exchange_sale: boolean;
  /** Parte paga com vale-troca */
  credit_amount: number;
}

export interface ListProductResponse {
  sale_item_id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  item_discount: number;
  product_name: string;
}

export interface ListAccReceivableResponse {
  installment_id: string;
  installment_balance: number;
  due_date: string;
  installment_number: number;
  installment_status: SaleStatus;
}

export interface ListSalesWithInstallmentsResponse {
  sale: ListSalesResponse;
  products: ListProductResponse[];
  installment: ListAccReceivableResponse[];
}

export interface SaleListResponse {
  data: ListSalesWithInstallmentsResponse[];
  page: number;
  per_page: number;
  total_rows: number;
  total_pages: number;
  sales_count: number;
  total_invoiced: number;
  total_pending: number;
  sales_canceled: number;
}

export interface GetSalesSummaryResponse {
  current_month_st: number;
  last_month_st: number;
  growth_percentage: number;
}

export interface GetTotalValuePenddingResponse {
  total_pending: number;
}

export interface GetTop5ProductsResponse {
  product_name: string;
  product_real_profit: number;
  total_sale: number;
}

export interface GetInventoryTurnoverResponse {
  inventory_turnover: number;
}

/** Período da visão geral; datas locais da empresa, fim incluso.
 * Sem start_date = desde a primeira venda; sem end_date = até hoje */
export interface GetSalesOverviewParams {
  start_date?: string; // formato: YYYY-MM-DD
  end_date?: string; // formato: YYYY-MM-DD
}

export interface SalesOverviewTotals {
  sales_count: number;
  revenue: number;
  average_ticket: number;
  discounts: number;
  items_sold: number;
  customers_count: number;
  canceled_count: number;
  canceled_amount: number;
  /** Devoluções registradas no período */
  returned_amount: number;
  /** Saldo em aberto das parcelas das vendas do período */
  open_receivable: number;
  overdue_receivable: number;
}

export interface SalesOverviewPoint {
  date: string;
  sales_count: number;
  revenue: number;
}

export interface GetSalesOverviewResponse {
  start_date: string;
  end_date: string;
  /** Granularidade da série, escolhida pela API conforme o tamanho do período */
  period: "day" | "week" | "month";
  totals: SalesOverviewTotals;
  /** Período anterior de mesmo tamanho; zerado em "desde o início" */
  previous: SalesOverviewTotals;
  series: SalesOverviewPoint[];
}
