import { useQuery } from "@tanstack/react-query";
import { GetProducts } from "@/service/products.service";

export const useProducts = () => {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["products-stock"],
    queryFn: () => GetProducts(),

    refetchInterval: 10000,
    refetchOnWindowFocus: true,
  });

  return {
    products: data?.data || [],
    productsCount: data?.total_rows || 0,
    totalValueInStock: data?.total_value_in_stock || 0,
    itensInStock: data?.itens_in_stock || 0,
    lowItensInStock: data?.low_itens_in_stock || 0,
    loading: isLoading,
    error: isError
      ? "Erro ao carregar os produtos. Por favor, tente novamente."
      : null,
    refetch,
  };
};
