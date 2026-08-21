import {
  GetUseMenssagesResponse,
  UpdateDefaultPaymentMethodSubiscriptionParams,
} from "./../interfaces/subscription-manager.interface";
import {
  CancelSubiscriptionParams,
  CreatePaymentMethodParams,
  SubscriptionDetailsResponse,
} from "@/interfaces/subscription-manager.interface";
import { api } from "./api";

export const GetSubscriptionDetails =
  async (): Promise<SubscriptionDetailsResponse> => {
    const response = await api.get<SubscriptionDetailsResponse>(
      "/subscription-management/subscription",
    );
    return response.data;
  };

export const CreatePaymentMethod = async (
  params: CreatePaymentMethodParams,
): Promise<void> => {
  await api.post("/subscription-management/payment-methods", params);
};

export const CancelSubiscription = async (
  params: CancelSubiscriptionParams,
): Promise<void> => {
  await api.post(`/subscription/cancel`, params);
};

export const UpdateDefaultPaymentMethodSubiscription = async (
  subscriptionId: string,
  params: UpdateDefaultPaymentMethodSubiscriptionParams,
): Promise<void> => {
  await api.post(`/payment-methods/:${subscriptionId}/default`, params);
};

export const GetUsageMenssages = async (): Promise<GetUseMenssagesResponse> => {
  const response = await api.get<GetUseMenssagesResponse>(
    "/subscription-management/whatsapp-use",
  );
  return response.data;
};
