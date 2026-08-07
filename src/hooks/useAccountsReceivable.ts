import { useQuery } from "@tanstack/react-query";
import { ListAccountsReceivable } from "@/service/accounts-receivable.service";
import { AccountsReceivablePaginationParams } from "@/interfaces/accounts-receivable.interface";

export const useAccountsReceivable = (
  paginationParams?: AccountsReceivablePaginationParams,
) => {
  const pagination = paginationParams ?? { Page: 1, PerPage: 10 };

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
      ? "Erro ao carregar as contas a receber. Por favor, tente novamente."
      : null,
    refetch,
  };
};
