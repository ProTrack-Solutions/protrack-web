import { useQuery } from "@tanstack/react-query";
import { GetClient } from "@/service/clients.service";

export const useClients = () => {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["clients"],
    queryFn: () => GetClient(),

    refetchInterval: 10000,
    refetchOnWindowFocus: true,
  });

  return {
    clients: data?.data || [],
    clientsCount: data?.total_rows || 0,
    loading: isLoading,
    error: isError
      ? "Erro ao carregar os clientes. Por favor, tente novamente."
      : null,
    refetch,
  };
};
