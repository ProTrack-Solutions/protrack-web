import {
  GetCashFlowOverviewParams,
  GetCashFlowOverviewResponse,
  GetCashFlowResponse,
} from "@/interfaces/cash-flow.interface";
import { api } from "./api";

export const GetCashFlow = async (): Promise<GetCashFlowResponse[]> => {
  const response = await api.get<GetCashFlowResponse[]>("/cash-flow");
  return response.data;
};

export const GetCashFlowOverview = async (
  params: GetCashFlowOverviewParams,
): Promise<GetCashFlowOverviewResponse> => {
  const response = await api.get<GetCashFlowOverviewResponse>(
    "/cash-flow/overview",
    { params },
  );
  return response.data;
};
