import { GetTotalSummaryParams } from "@/interfaces/cash-flow.interface";
import { GetSummaryMonth, GetTotalSummary } from "@/service/cash-flow.service";
import { useQuery } from "@tanstack/react-query";

export const useCashFlow = ({ period, quantity }: GetTotalSummaryParams) => {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["cash-flow"],
    queryFn: async () => {
      const [summaryMonth, totalSummary] = await Promise.all([
        GetSummaryMonth(),
        GetTotalSummary({
          period: period,
          quantity: quantity,
        }),
      ]);

      return {
        totalSummary,
        summaryMonth,
      };
    },

    refetchInterval: 10000,
    refetchOnWindowFocus: true,
  });

  return {
    cashFlowTotalSummary: data?.totalSummary,
    cashFlowSummaryMonth: data?.summaryMonth,
    loading: isLoading,
    error: isError
      ? "Erro ao carregar os produtos. Por favor, tente novamente."
      : null,
    refetch,
  };
};
