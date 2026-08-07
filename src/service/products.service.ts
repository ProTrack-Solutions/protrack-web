import {
  GetTopProductsResponse,
  ProductResponse,
  ProductUpdateParams,
  CreateProductParams,
  GetTotalInStockResponse,
} from "@/interfaces/products.interface";
import { api } from "./api";
import { Pagination } from "@/interfaces/pagination.interface";

export const GetProducts = async (
  PaginationParams: Pagination,
): Promise<ProductResponse> => {
  const response = await api.get<ProductResponse>("/product/company", {
    params: {
      page: PaginationParams.Page,
      perPage: PaginationParams.PerPage,
      startDate: PaginationParams.StartDate,
      endDate: PaginationParams.EndDate,
      search: PaginationParams.Search,
      orderBy: PaginationParams.OrderBy,
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

export const GetTopProducts = async (): Promise<GetTopProductsResponse[]> => {
  const response = await api.get<GetTopProductsResponse[]>(
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
