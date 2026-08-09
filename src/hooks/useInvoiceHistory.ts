import { useQuery } from "@tanstack/react-query";
import { ListInvoiceHistoryByCompany } from "@/service/invoice-history.service";
import { Pagination } from "@/interfaces/pagination.interface";

export const useInvoiceHistory = (pagination?: Pagination) => {
  const params = pagination ?? { Page: 1, PerPage: 10 };

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["invoice-history", params.Page, params.PerPage],
    queryFn: () => ListInvoiceHistoryByCompany(params),

    refetchInterval: 10000,
    refetchOnWindowFocus: true,
  });

  return {
    invoices: data?.data ?? [],
    totalRows: data?.total_rows ?? 0,
    totalPages: data?.total_pages ?? 0,
    loading: isLoading,
    error: isError
      ? "Erro ao carregar o histórico de pagamentos. Por favor, tente novamente."
      : null,
    refetch,
  };
};
