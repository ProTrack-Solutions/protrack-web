export interface GetBillsPayableSummaryResponse {
  general_status: string;
  total_overdue: number;
  total_quantity: number;
  total_scheduled: number;
  total_to_pay: number;
}
