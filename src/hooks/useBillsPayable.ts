import { useQuery } from "@tanstack/react-query";
import { ListBillsPayable } from "@/service/bills-payable.service";
import { BillsPayablePaginationParams } from "@/interfaces/bills-payable.interface";

export const useBillsPayable = (
  paginationParams?: BillsPayablePaginationParams,
) => {
  const pagination = paginationParams ?? { Page: 1, PerPage: 10 };

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
      ? "Erro ao carregar as contas a pagar. Por favor, tente novamente."
      : null,
    refetch,
  };
};
