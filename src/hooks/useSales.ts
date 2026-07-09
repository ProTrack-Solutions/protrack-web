import { GetSales } from "@/service/sale.service";
import { useQuery } from "@tanstack/react-query";

export const useSales = () => {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["sales"],
    queryFn: () => GetSales(),

    refetchInterval: 10000,
    refetchOnWindowFocus: true,
  });

  return {
    sales: data?.data || [],
    salesCount: data?.total_rows || 0,
    totalInvoiced: data?.total_invoiced,
    totalPending: data?.total_pending,
    salesCanceled: data?.sales_canceled,
    loading: isLoading,
    error: isError
      ? "Erro ao carregar os clientes. Por favor, tente novamente."
      : null,
    refetch,
  };
};
