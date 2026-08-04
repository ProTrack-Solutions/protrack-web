import { useQuery } from "@tanstack/react-query";
import { ListBillsPayable } from "@/service/bills-payable.service";
import { Pagination } from "@/interfaces/pagination.interface";

export const useBillsPayable = (pagination: Pagination) => {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["bills-payable", pagination.Page, pagination.PerPage],
    queryFn: () => ListBillsPayable(pagination),

    refetchInterval: 10000,
    refetchOnWindowFocus: true,
  });

  return {
    billsPayable: data?.data || [],
    billsPayableCount: data?.total_rows || 0,
    totalPayable: data?.total_payable || 0,
    totalOverdue: data?.total_overdue || 0,
    totalScheduled: data?.total_scheduled || 0,
    totalPages: data?.total_pages || 0,
    loading: isLoading,
    error: isError
      ? "Erro ao carregar os produtos. Por favor, tente novamente."
      : null,
    refetch,
  };
};
