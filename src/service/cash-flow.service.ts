import {
  GetCashFlowResponse,
  GetTotalSummaryParams,
  GetTotalSummaryResponse,
} from "@/interfaces/cash-flow.interface";
import { api } from "./api";

export const GetCashFlow = async (): Promise<GetCashFlowResponse[]> => {
  const response = await api.get<GetCashFlowResponse[]>("/cash-flow");
  return response.data;
};

export const GetTotalSummary = async (
  params: GetTotalSummaryParams,
): Promise<GetTotalSummaryResponse> => {
  const response = await api.get<GetTotalSummaryResponse>(
    `/cash-flow/total-summary?period=${params.period}&quantity=${params.quantity}`,
  );
  return response.data;
};
