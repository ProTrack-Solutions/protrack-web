import { useQuery } from "@tanstack/react-query";
import {
  GetSalesSummary,
  GetTop5Products,
  GetTotalValuePendding,
} from "@/service/sale.service";
import { GetTotalInStock } from "@/service/products.service";
import { GetPaymentMethodsStats } from "@/service/payment-methods.service";
import { GetBillsPayableSummary } from "@/service/bills-payable.service";
import { GetCashFlow } from "@/service/cash-flow.service";

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
        billsPayableSummary,
        cashFlow,
      ] = await Promise.all([
        GetSalesSummary(),
        GetTotalValuePendding(),
        GetTop5Products(),
        GetPaymentMethodsStats(),
        GetTotalInStock(),
        GetBillsPayableSummary(),
        GetCashFlow(),
      ]);

      return {
        salesSummary,
        totalSalePendding,
        topProducts,
        paymentMethodsStats,
        totalValueInStock,
        billsPayableSummary,
        cashFlow,
      };
    },
    refetchInterval: 10000,
    refetchOnWindowFocus: true,
  });

  return {
    salesSummaryData: data?.salesSummary,
    totalSalesPedding: data?.totalSalePendding.total_pending,
    topProducts: data?.topProducts,
    paymentMethodsStats: data?.paymentMethodsStats,
    totalValueInStock: data?.totalValueInStock,
    billsPayableSummary: data?.billsPayableSummary,
    cashFlow: data?.cashFlow,
    loading: isLoading,
    error: isError
      ? "Erro ao carregar dados do dashboard. Por favor, tente novamente."
      : null,
    refetch,
  };
};
