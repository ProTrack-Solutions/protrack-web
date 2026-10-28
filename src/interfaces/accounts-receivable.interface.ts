import { Pagination } from "./pagination.interface";

export interface AccountsReceivablePaginationParams extends Pagination {
  saleId?: string;
  status?: "pending" | "paid" | "overdue" | "partial";
  startDueDate?: string;
  endDueDate?: string;
  orderField?: "due_date" | "created_at";
}

export interface AccountsReceivable {
  balance: number;
  company_id: string;
  created_at: string;
  created_by: string;
  customer_id: string;
  customer_name: string;
  days_overdue: number;
  deleted_at: string;
  due_date: string;
  id: string;
  installment_number: number;
  sale_id: string;
  status: string;
  total_amount: number;
  total_installments: number;
  updated_at: string;
  updated_by: string;
  /** Último lembrete enviado pelo WhatsApp; null se nunca enviou */
  last_reminder_at: string | null;
}

export interface ReceivableReminderResponse {
  kind: "overdue" | "due";
  template_name: string;
  recipient_phone: string;
  sent_at: string;
  next_reminder_at: string;
}

export interface ListAccountsReceivableResponse {
  data: AccountsReceivable[];
  page: number;
  per_page: number;
  total_pages: number;
  total_rows: number;
  amount: number;
  amount_overdue: number;
}
