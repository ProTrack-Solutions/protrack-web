import { GetTotalSummaryParams } from "@/interfaces/cash-flow.interface";
import { GetTotalSummary } from "@/service/cash-flow.service";
import { useQuery } from "@tanstack/react-query";

export const useCashFlow = ({ period, quantity }: GetTotalSummaryParams) => {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["cash-flow"],
    queryFn: () =>
      GetTotalSummary({
        period: period,
        quantity: quantity,
      }),

    refetchInterval: 10000,
    refetchOnWindowFocus: true,
  });

  return {
    cashFlowTotalSummary: data,

    loading: isLoading,
    error: isError
      ? "Erro ao carregar os produtos. Por favor, tente novamente."
      : null,
    refetch,
  };
};
