import {
  CreateProductCategoryParams,
  ProductCategoriesResponse,
} from "@/interfaces/product-categories.interface";
import { api } from "./api";

export const GetProductsCategories = async (): Promise<
  ProductCategoriesResponse[]
> => {
  const response = await api.get<ProductCategoriesResponse[]>(
    "/products-categories/list/company",
  );
  return response.data;
};

export const CreateProductCategory = async (
  params: CreateProductCategoryParams,
): Promise<void> => {
  await api.post("/products-categories", params);
};
