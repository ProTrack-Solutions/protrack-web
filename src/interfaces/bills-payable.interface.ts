import { BillsPayableStatus } from "@/enum/billsPayableStatus.enum";

export interface GetBillsPayableSummaryResponse {
  general_status: string;
  total_overdue: number;
  total_quantity: number;
  total_scheduled: number;
  total_to_pay: number;
}

export interface BillsPayable {
  amount: number;
  amount_paid: number;
  category_id: string;
  category_name: string;
  company_id: string;
  created_at: string;
  description: string;
  due_date: string;
  id: string;
  notes: string;
  payment_date: string;
  payment_method_id: string;
  payment_method_name: string;
  scheduled_date: string;
  status: string;
  updated_at: string;
  vendor_id: string;
  vendor_name: string;
}

export interface ListBillsPayableResponse {
  data: BillsPayable[];
  page: number;
  per_page: number;
  total_overdue: number;
  total_pages: number;
  total_payable: number;
  total_rows: number;
  total_scheduled: number;
}

export interface CreateBillsPayableParams {
  amount: number;
  category_id: string;
  description: string;
  due_date: string;
  notes: string;
  payment_method_id: string;
  vendor_id: string;
}

export interface PaymentBillParams {
  amount_paid: number;
  payment_date: string;
  payment_method_id: string;
}

export interface SheduleBillParams {
  scheduled_date: string;
}
