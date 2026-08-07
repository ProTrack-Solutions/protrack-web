import { useQuery } from "@tanstack/react-query";
import { GetClient } from "@/service/clients.service";
import { Pagination } from "@/interfaces/pagination.interface";
import { ClientsPaginationParams } from "@/interfaces/client.interface";

export const useClients = (paginationParams?: ClientsPaginationParams) => {
  const pagination = paginationParams ?? { Page: 1, PerPage: 10 };

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["clients", pagination.Page, pagination.PerPage],
    queryFn: () => GetClient(pagination),

    refetchInterval: 10000,
    refetchOnWindowFocus: true,
  });

  return {
    clients: data?.data || [],
    clientsCount: data?.total_rows || 0,
    totalPages: data?.total_pages || 0,
    loading: isLoading,
    error: isError
      ? "Erro ao carregar os clientes. Por favor, tente novamente."
      : null,
    refetch,
  };
};
