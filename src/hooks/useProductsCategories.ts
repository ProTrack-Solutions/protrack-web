import { GetProductsCategories } from "@/service/products-categories.service";
import { useQuery } from "@tanstack/react-query";

export const useProductsCategories = () => {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["products-products-categories"],
    queryFn: () => GetProductsCategories(),

    refetchInterval: 10000,
    refetchOnWindowFocus: true,
  });

  return {
    productsCategories: data,
    isLoading,
    isError,
    refetch,
  };
};
