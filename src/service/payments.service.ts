import { PaymentParams } from "@/interfaces/payment.interface";
import { api } from "./api";

export const Payment = async (params: PaymentParams): Promise<void> => {
  await api.post("/payments", params);
};
