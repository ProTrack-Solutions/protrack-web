import { api } from "./api";
import {
  CreateSaleParams,
  GetInventoryTurnoverResponse,
  GetSalesSummaryResponse,
  GetTop5ProductsResponse,
  GetTotalValuePenddingResponse,
  SaleListResponse,
  SalePaginationParams,
  UpdateSaleParams,
} from "@/interfaces/sale.interface";

export const GetSales = async (
  pagination: SalePaginationParams,
): Promise<SaleListResponse> => {
  const response = await api.get<SaleListResponse>("/sales/complete", {
    params: {
      page: pagination.Page,
      perPage: pagination.PerPage,
      search: pagination.Search,
      sortBy: pagination.sortBy,
      orderBy: pagination.OrderBy,
      saleStatus: pagination.saleStatus,
      paymentMethod: pagination.paymentMethod,
      paymentStartDate: pagination.paymentStartDate,
      paymentEndDate: pagination.paymentEndDate,
      saleStartDate: pagination.saleStartDate,
      saleEndDate: pagination.saleEndDate,
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

export const GetTop5Products = async (): Promise<GetTop5ProductsResponse[]> => {
  const response = await api.get<GetTop5ProductsResponse[]>(
    "/sales/top5-products",
  );
  return response.data;
};

export const GetInventoryTurnover =
  async (): Promise<GetInventoryTurnoverResponse> => {
    const response = await api.get<GetInventoryTurnoverResponse>(
      "/sales/stock-turnover",
    );
    return response.data;
  };
