import { ProductCategoriesResponse } from "@/@types/products-categories.type";
import { api } from "./api";

export const GetProductsCategories = async (): Promise<
  ProductCategoriesResponse[]
> => {
  const response = await api.get<ProductCategoriesResponse[]>(
    "/products-categories/list/company",
  );
  return response.data;
};
