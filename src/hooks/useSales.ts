import { Pagination } from "@/interfaces/pagination.interface";
import { GetSales } from "@/service/sale.service";
import { useQuery } from "@tanstack/react-query";

export const useSales = (pagination: Pagination) => {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["sales", pagination.Page, pagination.PerPage],
    queryFn: () => GetSales(pagination),

    refetchInterval: 10000,
    refetchOnWindowFocus: true,
  });

  return {
    sales: data?.data || [],
    salesCount: data?.total_rows || 0,
    totalInvoiced: data?.total_invoiced,
    totalPending: data?.total_pending,
    salesCanceled: data?.sales_canceled,
    totalPages: data?.total_pages || 0,
    loading: isLoading,
    error: isError
      ? "Erro ao carregar os clientes. Por favor, tente novamente."
      : null,
    refetch,
  };
};
