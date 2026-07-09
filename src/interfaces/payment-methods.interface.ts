import { PaymentMethod } from "@/enum/methodPayments";

export interface GetPaymentMethodsStatsResponse {
  payment_method: PaymentMethod;
  percentage_method: number;
}
