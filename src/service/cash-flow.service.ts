import { GetCashFlowResponse } from "@/interfaces/cash-flow.interface";
import { api } from "./api";

export const GetCashFlow = async (): Promise<GetCashFlowResponse[]> => {
  const response = await api.get<GetCashFlowResponse[]>("/cash-flow");
  return response.data;
};
