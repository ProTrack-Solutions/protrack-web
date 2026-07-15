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
