import { Product, ProductResponse } from "@/@types/stock.type";
import { api } from "./api";

export const GetProducts = async (): Promise<ProductResponse> => {
  const response = await api.get<ProductResponse>("/product/company", {
    headers: {
      Page: 1,
      PerPage: 10,
    },
  });
  return response.data;
};
