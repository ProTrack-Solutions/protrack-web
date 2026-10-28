export type CustomerSegment = "all" | "debtors" | "overdue" | "credit" | "no_purchases";
export type CustomerSort = "recent" | "name" | "last_purchase" | "total_spent" | "balance";
export type CustomerStatus = "active" | "inactive" | "all";

export interface CustomerOverview {
  active_count: number;
  inactive_count: number;
  new_this_month: number;
  new_last_month: number;
  debtors_count: number;
  debt_total: number;
  overdue_count: number;
  overdue_total: number;
  credit_count: number;
  credit_total: number;
  /** Clientes que compraram nos últimos 30 dias */
  recent_buyers: number;
}

export interface BrowseCustomersParams {
  page?: number;
  per_page?: number;
  search?: string;
  status?: CustomerStatus;
  segment?: CustomerSegment;
  sort?: CustomerSort;
}

export interface CustomerRow {
  id: string;
  full_name: string;
  cpf: string;
  email: string;
  whatsapp: string;
  mobile_phone: string;
  city: string;
  state: string;
  balance_due: number;
  overdue_total: number;
  store_credit: number;
  purchases_count: number;
  /** Total comprado já sem as devoluções */
  purchases_total: number;
  last_purchase_at: string | null;
  created_at: string;
  active: boolean;
}

export interface BrowseCustomersResponse {
  data: CustomerRow[];
  page: number;
  per_page: number;
  total: number;
}

export interface CustomerInstallment {
  id: string;
  sale_id: string;
  installment_number: number;
  total_installments: number;
  due_date: string;
  total_amount: number;
  balance: number;
  status: string;
  overdue: boolean;
}

export interface CustomerRecentSale {
  id: string;
  created_at: string;
  total_amount: number;
  payment_method: string;
  status: string;
  items_count: number;
  products: string;
  returned_total: number;
}

export interface CustomerCreditMovement {
  id: string;
  type: "return" | "sale" | "sale_cancel";
  amount: number;
  balance_after: number;
  sale_return_id: string | null;
  return_number: number | null;
  sale_id: string | null;
  created_at: string;
}

export type CustomerRhythm = "none" | "new" | "regular" | "late" | "away";
export type DayPeriod = "morning" | "afternoon" | "evening" | "night";

export interface CustomerInsights {
  top_products: { name: string; quantity: number; total: number; last_bought_at: string }[];
  top_categories: { name: string; total: number; share: number }[];
  favorite_size: { value: string; quantity: number; share: number } | null;
  favorite_color: { value: string; quantity: number; share: number } | null;
  /** 0 = domingo ... 6 = sábado */
  weekdays: { weekday: number; count: number; total: number }[];
  best_weekday: number | null;
  periods: { period: DayPeriod; count: number }[];
  best_period: DayPeriod | "";
  favorite_payment: { method: string; count: number; share: number } | null;
  average_interval_days: number | null;
  days_since_last: number | null;
  next_expected_at: string | null;
  rhythm: CustomerRhythm;
}

export interface CustomerProfile {
  id: string;
  full_name: string;
  cpf: string;
  rg: string;
  birth_date: string | null;
  gender: string;
  marital_status: string;
  email: string;
  whatsapp: string;
  mobile_phone: string;
  home_phone: string;
  address_street: string;
  address_number: string;
  address_complement: string;
  address_neighborhood: string;
  address_city: string;
  address_state: string;
  address_zipcode: string;
  created_at: string;
  active: boolean;
  balance_due: number;
  overdue_total: number;
  store_credit: number;
  purchases_count: number;
  purchases_total: number;
  returned_total: number;
  average_ticket: number;
  first_purchase_at: string | null;
  last_purchase_at: string | null;
  insights: CustomerInsights;
  open_installments: CustomerInstallment[];
  recent_sales: CustomerRecentSale[];
  credit_movements: CustomerCreditMovement[];
}
