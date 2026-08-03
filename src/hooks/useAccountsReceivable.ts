import { useQuery } from "@tanstack/react-query";
import { ListAccountsReceivable } from "@/service/accounts-receivable.service";

export const useAccountsReceivable = () => {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["accounts-receivable"],
    queryFn: () => ListAccountsReceivable(),

    refetchInterval: 10000,
    refetchOnWindowFocus: true,
  });

  return {
    accountsReceivable: data,
    loading: isLoading,
    error: isError
      ? "Erro ao carregar os produtos. Por favor, tente novamente."
      : null,
    refetch,
  };
};
