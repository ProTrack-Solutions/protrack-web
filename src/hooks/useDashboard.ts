import { useQuery } from "@tanstack/react-query";
import { GetSalesSummary, GetTotalValuePendding } from "@/service/sale.service";
import {
  GetProducts,
  GetTopProducts,
  GetTotalInStock,
} from "@/service/products.service";
import { GetPaymentMethodsStats } from "@/service/payment-methods.service";

export const useDashboard = () => {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["dashboard"],
    queryFn: async () => {
      const [
        salesSummary,
        totalSalePendding,
        topProducts,
        paymentMethodsStats,
        totalValueInStock,
      ] = await Promise.all([
        GetSalesSummary(),
        GetTotalValuePendding(),
        GetTopProducts(),
        GetPaymentMethodsStats(),
        GetTotalInStock(),
      ]);

      return {
        salesSummary,
        totalSalePendding,
        topProducts,
        paymentMethodsStats,
        totalValueInStock,
      };
    },
    refetchInterval: 10000,
    refetchOnWindowFocus: true,
  });

  return {
    SalesSummaryData: data?.salesSummary,
    TotalSalesPedding: data?.totalSalePendding,
    TopProducts: data?.topProducts,
    PaymentMethodsStats: data?.paymentMethodsStats,
    TotalValueInStock: data?.totalValueInStock,
    loading: isLoading,
    error: isError
      ? "Erro ao carregar dados do dashboard. Por favor, tente novamente."
      : null,
    refetch,
  };
};
