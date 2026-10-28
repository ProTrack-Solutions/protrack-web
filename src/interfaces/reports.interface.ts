export type ReportType =
  | "sales"
  | "sales_by_day"
  | "sales_by_payment_method"
  | "sales_by_seller"
  | "sales_by_customer"
  | "products_abc"
  | "profit_category"
  | "inventory"
  | "stock_movements"
  | "dre"
  | "payments_received"
  | "open_installments"
  | "bills_payable"
  | "cash_sessions";

export type ReportFormat = "json" | "xlsx" | "pdf";

export type ReportColumnType =
  | "text"
  | "money"
  | "number"
  | "percent"
  | "date"
  | "datetime";

export interface GetReportParams {
  type: ReportType;
  start_date: string; // YYYY-MM-DD, inclusivo
  end_date: string; // YYYY-MM-DD, inclusivo
}

export interface ReportColumn {
  key: string;
  label: string;
  type: ReportColumnType;
}

export interface ReportSummaryItem {
  label: string;
  value: number;
  type: ReportColumnType;
}

/** Datas chegam como ISO com o fuso da empresa ("2026-10-05T14:30:00-03:00") */
export type ReportCell = string | number | boolean | null;

export interface ReportResponse {
  type: ReportType;
  title: string;
  description: string;
  company_name: string;
  uses_period: boolean;
  start_date: string;
  end_date: string;
  generated_at: string;
  columns: ReportColumn[];
  /** Cada linha segue a ordem de `columns` */
  rows: ReportCell[][];
  /** Mesmo tamanho de `columns`, com null nas colunas que não somam */
  totals?: ReportCell[];
  summary: ReportSummaryItem[];
  notes?: string[];
}
