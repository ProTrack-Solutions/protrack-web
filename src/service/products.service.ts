import { ProductResponse } from "@/@types/stock.type";
import { api } from "./api";
import { CreateProductParams } from "@/@types/product-registration.type";

export const GetProducts = async (): Promise<ProductResponse> => {
  const response = await api.get<ProductResponse>("/product/company", {
    headers: {
      Page: 1,
      PerPage: 10,
    },
  });
  return response.data;
};

export const CreateProduct = async (params: CreateProductParams) => {
  const response = await api.post("/product", params);
  console.log("CreateProduct", params);
  return response.data;
};
