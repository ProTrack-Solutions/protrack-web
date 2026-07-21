export interface GetCashFlowResponse {
  date: string;
  total_inflow: number;
  total_outflow: number;
}

export interface GetTotalSummaryParams {
  period: string;
  quantity: number;
}

export interface Summary {
  period: string;
  total_period_outflow: number;
  total_period_inflow: number;
  total_period: number;
}

export interface TotalCategoriesInFlow {
  name_category: string;
  total_inflow: number;
  percentage_in_flow: number;
}

export interface TotalCategoriesOutFlow {
  name_category: string;
  total_outflow: number;
  percentage_in_flow: number;
}

export interface GetTotalSummaryResponse {
  summary: Summary[];
  total_categories_in_flow: TotalCategoriesInFlow[];
  total_categories_out_flow: TotalCategoriesOutFlow[];
  total_outflow: number;
  total_inflow: number;
  total: number;
  projection: number;
}

export interface GetSummaryMonthResponse {
  mount: string;
  total_inflow: number;
  total_outflow: number;
}
