import { useQuery } from "@tanstack/react-query";
import { GetProducts } from "@/service/products.service";
import { Pagination } from "@/interfaces/pagination.interface";

export const useProducts = (paginationParams?: Pagination) => {
  const pagination = paginationParams ?? { Page: 1, PerPage: 10 };

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["products-stock", pagination.Page, pagination.PerPage],
    queryFn: () => GetProducts(pagination),

    refetchInterval: 10000,
    refetchOnWindowFocus: true,
  });

  return {
    products: data?.data || [],
    productsCount: data?.total_rows || 0,
    totalValueInStock: data?.total_value_in_stock || 0,
    itensInStock: data?.itens_in_stock || 0,
    lowItensInStock: data?.low_itens_in_stock || 0,
    totalPages: data?.total_pages || 0,
    loading: isLoading,
    error: isError
      ? "Erro ao carregar os produtos. Por favor, tente novamente."
      : null,
    refetch,
  };
};
