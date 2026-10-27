export interface GetCashFlowResponse {
  date: string;
  total_inflow: number;
  total_outflow: number;
}

export type CashFlowPeriod = "day" | "week" | "month";

export interface GetCashFlowOverviewParams {
  period: CashFlowPeriod;
  quantity: number;
  forecast_days?: number;
}

export interface CashFlowTotals {
  inflow: number;
  outflow: number;
  net: number;
  inflow_count: number;
  outflow_count: number;
}

export interface CashFlowPoint {
  /** Início do período, "YYYY-MM-DD" */
  date: string;
  inflow: number;
  outflow: number;
  net: number;
  /** Resultado acumulado desde o início do intervalo */
  balance: number;
}

export interface CashFlowShare {
  name: string;
  total: number;
  percentage: number;
  count?: number;
}

export interface CashFlowForecastPoint {
  date: string;
  receivable: number;
  payable: number;
  /** Saldo previsto acumulado até o dia */
  balance: number;
}

export interface CashFlowForecast {
  days: number;
  receivable: number;
  payable: number;
  net: number;
  overdue_receivable: number;
  overdue_payable: number;
  series: CashFlowForecastPoint[];
}

export interface CashFlowMovement {
  id: string;
  kind: "inflow" | "outflow";
  /** Cliente da venda ou descrição da conta */
  description: string;
  /** Forma de pagamento (entrada) ou categoria (saída) */
  detail: string;
  amount: number;
  occurred_at: string;
}

export interface GetCashFlowOverviewResponse {
  period: CashFlowPeriod;
  quantity: number;
  start_date: string;
  end_date: string;
  totals: CashFlowTotals;
  previous: CashFlowTotals;
  /** Tendência linear do resultado para o próximo período */
  projection: number;
  series: CashFlowPoint[];
  inflow_by_category: CashFlowShare[];
  outflow_by_category: CashFlowShare[];
  inflow_by_payment_method: CashFlowShare[];
  forecast: CashFlowForecast;
  recent_movements: CashFlowMovement[];
}
