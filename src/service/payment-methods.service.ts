import { GetPaymentMethodsStatsResponse } from "@/interfaces/payment-methods.interface";
import { api } from "./api";

export const GetPaymentMethodsStats = async (): Promise<
  GetPaymentMethodsStatsResponse[]
> => {
  const response = await api.get<GetPaymentMethodsStatsResponse[]>(
    "/payment-methods/stats",
  );
  return response.data;
};
