// Status persistidos pela API em invoice_history.status (ver migration
// 000023_create_table_invoice_history): 'approved', 'rejected', 'refunded',
// 'in_process'.
export type InvoiceHistoryStatus =
  | "approved"
  | "rejected"
  | "refunded"
  | "in_process";

export interface InvoiceHistory {
  id: string;
  subscription_id: string;
  company_id: string;
  payment_method_id: string;
  external_payment_id: string;
  amount_cents: number;
  status: InvoiceHistoryStatus | string;
  paid_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface InvoiceHistoryPaginatedResponse {
  data: InvoiceHistory[];
  page: number;
  per_page: number;
  total_rows: number;
  total_pages: number;
}
