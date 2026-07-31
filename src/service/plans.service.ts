import { PlansResponse } from "@/interfaces/plans.interface";
import { api } from "./api";

export const GetPlans = async (): Promise<PlansResponse[]> => {
  const response = await api.get<PlansResponse[]>("/plans?active=true");
  return response.data;
};
