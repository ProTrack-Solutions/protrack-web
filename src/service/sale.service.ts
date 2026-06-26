import { SaleListResponse } from "@/interfaces/sales-list.interface";
import { api } from "./api";
import { CreateSaleParams } from "@/interfaces/sale.interface";

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
  await api.post<SaleListResponse>("/sales", params);
};
