import { PaymentMethod } from "@/enum/methodPayments";

export interface GetPaymentMethodsStatsResponse {
  payment_method: PaymentMethod;
  percentage_method: number;
}

export interface ListPaymentMethodsResponse {
  created_at: string;
  id: string;
  is_active: boolean;
  name: string;
  type: string;
  updated_at: string;
}
