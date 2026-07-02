import { api } from "./api";
import {
  CreateSaleParams,
  GetSalesSummaryResponse,
  GetTotalValuePenddingResponse,
  SaleListResponse,
  UpdateSaleParams,
} from "@/interfaces/sale.interface";

export const GetSales = async (): Promise<SaleListResponse> => {
  const response = await api.get<SaleListResponse>("/sales/complete", {
    headers: {
      Page: 1,
      PerPage: 20,
    },
  });

  return response.data;
};

export const CreateSale = async (params: CreateSaleParams): Promise<void> => {
  await api.post("/sales", params);
};

export const UpdateSale = async (
  params: UpdateSaleParams,
  saleId: string,
): Promise<void> => {
  await api.put(`/sales/${saleId}`, params);
};

export const GetSalesSummary = async (): Promise<GetSalesSummaryResponse> => {
  const response = await api.get<GetSalesSummaryResponse>(
    "/sales/total-amount",
  );
  return response.data;
};

export const GetTotalValuePendding =
  async (): Promise<GetTotalValuePenddingResponse> => {
    const response = await api.get<GetTotalValuePenddingResponse>(
      "/sales/total-pending",
    );
    return response.data;
  };
