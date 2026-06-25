import { ProductCategoriesResponse } from "@/interfaces/products-categories.interface";
import { api } from "./api";

export const GetProductsCategories = async (): Promise<
  ProductCategoriesResponse[]
> => {
  const response = await api.get<ProductCategoriesResponse[]>(
    "/products-categories/list/company",
  );
  return response.data;
};
