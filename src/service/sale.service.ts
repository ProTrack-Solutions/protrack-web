import { SaleListResponse } from "@/interfaces/sales-list.interface";
import { api } from "./api";

export const GetSales = async (): Promise<SaleListResponse> => {
  const response = await api.get<SaleListResponse>("/sales/complete", {
    headers: {
      Page: 1,
      PerPage: 10,
    },
  });

  return response.data;
};
