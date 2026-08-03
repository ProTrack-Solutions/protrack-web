import {
  CreatePaymentMethodsParams,
  GetPaymentMethodsStatsResponse,
  ListPaymentMethodsResponse,
  TogglePaymentMethodParams,
} from "@/interfaces/payment-methods.interface";
import { api } from "./api";
import { PaymentBillParams } from "@/interfaces/bills-payable.interface";

export const GetPaymentMethodsStats = async (): Promise<
  GetPaymentMethodsStatsResponse[]
> => {
  const response = await api.get<GetPaymentMethodsStatsResponse[]>(
    "/payment-methods/stats",
  );
  return response.data;
};

export const ListPaymentMethods = async (): Promise<
  ListPaymentMethodsResponse[]
> => {
  const response =
    await api.get<ListPaymentMethodsResponse[]>("/payment-methods");
  return response.data;
};

export const CreatePaymentMethods = async (
  params: CreatePaymentMethodsParams,
): Promise<void> => {
  await api.post("/payment-methods", params);
};

export const TogglePaymentMethod = async (
  methodId: string,
  param: TogglePaymentMethodParams,
): Promise<void> => {
  await api.put(`/payment-methods/${methodId}`, param);
};
