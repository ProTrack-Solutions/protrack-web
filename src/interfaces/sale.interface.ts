import { SaleStatus } from "@/app/utils/statusSales";
import { PaymentMethod } from "@/enum/methodPayments";

export const initialSaleFormData: CreateSaleParams = {
  customer_id: "",
  discount_amount: "",
  due_days: 0,
  payment_method: PaymentMethod.Cash,
  installments_count: 0,
  items: [],
  prohibited: 0,
};

export interface CreateSaleParams {
  customer_id: string;
  discount_amount: string;
  due_days: number;
  payment_method: PaymentMethod;
  installments_count: number;
  items: CreateSaleItemParams[];
  prohibited: number;
}

interface CreateSaleItemParams {
  product_id: string;
  quantity: number;
}

export interface UpdateSaleParams {
  discount_amount: number;
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
