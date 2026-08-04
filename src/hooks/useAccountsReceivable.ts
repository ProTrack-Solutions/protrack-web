import { useQuery } from "@tanstack/react-query";
import { ListAccountsReceivable } from "@/service/accounts-receivable.service";
import { Pagination } from "@/interfaces/pagination.interface";

export const useAccountsReceivable = (pagination: Pagination) => {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["accounts-receivable", pagination.Page, pagination.PerPage],
    queryFn: () => ListAccountsReceivable(pagination),

    refetchInterval: 10000,
    refetchOnWindowFocus: true,
  });

  return {
    accountsReceivable: data,
    loading: isLoading,
    totalPages: data?.total_pages || 0,
    error: isError
      ? "Erro ao carregar os produtos. Por favor, tente novamente."
      : null,
    refetch,
  };
};
