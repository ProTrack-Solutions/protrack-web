import {
  GetTopProductsResponse,
  ProductResponse,
  ProductUpdateParams,
  CreateProductParams,
  GetTotalInStockResponse,
} from "@/interfaces/products.interface";
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

export const CreateProduct = async (params: CreateProductParams) => {
  const response = await api.post("/product", params);
  console.log("CreateProduct", params);
  return response.data;
};

export const UpdateProcut = async (
  productId: string,
  params: ProductUpdateParams,
) => {
  const response = await api.put(`/product/${productId}`, params);
  return response.data;
};

export const GetTopProducts = async (): Promise<GetTopProductsResponse> => {
  const response = await api.get<GetTopProductsResponse>(
    "/product/top-products",
  );
  return response.data;
};

export const GetTotalInStock = async (): Promise<GetTotalInStockResponse> => {
  const response = await api.get<GetTotalInStockResponse>(
    "/product/cost-total",
  );
  return response.data;
};
