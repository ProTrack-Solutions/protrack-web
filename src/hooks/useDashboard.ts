import { useIsFetching, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import {
  GetInventoryTurnover,
  GetSalesSummary,
  GetTop5Products,
  GetTotalValuePendding,
} from "@/service/sale.service";
import { GetTotalInStock } from "@/service/products.service";
import { GetPaymentMethodsStats } from "@/service/payment-methods.service";
import {
  GetBillsPayableSummary,
  SumBillsPayable,
} from "@/service/bills-payable.service";
import { GetCashFlow } from "@/service/cash-flow.service";
import { ListTopAnnouncementsOfDay } from "@/service/announcements.service";

// Cada bloco do dashboard tem sua própria query: um endpoint lento não trava
// a tela inteira e cada card aparece assim que o seu dado chega.
// Indicadores que mudam a cada venda/pagamento atualizam a cada minuto;
// agregados históricos (gráficos, estoque) a cada 5 minutos.
const LIVE = 60_000;
const SLOW = 5 * 60_000;

const DASHBOARD_KEY = "dashboard";

const options = (interval: number) => ({
  staleTime: interval,
  refetchInterval: interval,
  refetchOnWindowFocus: true,
});

export const useSalesSummary = () =>
  useQuery({
    queryKey: [DASHBOARD_KEY, "sales-summary"],
    queryFn: GetSalesSummary,
    ...options(LIVE),
  });

export const useTotalReceivable = () =>
  useQuery({
    queryKey: [DASHBOARD_KEY, "total-receivable"],
    queryFn: GetTotalValuePendding,
    select: (data) => data.total_pending ?? 0,
    ...options(LIVE),
  });

export const useTotalPayable = () =>
  useQuery({
    queryKey: [DASHBOARD_KEY, "total-payable"],
    queryFn: SumBillsPayable,
    select: (data): number => Number(data) || 0,
    ...options(LIVE),
  });

export const useBillsPayableSummary = () =>
  useQuery({
    queryKey: [DASHBOARD_KEY, "bills-payable-summary"],
    queryFn: GetBillsPayableSummary,
    ...options(LIVE),
  });

export const useTopAnnouncements = () =>
  useQuery({
    queryKey: [DASHBOARD_KEY, "announcements"],
    queryFn: ListTopAnnouncementsOfDay,
    ...options(LIVE),
  });

export const useCashFlowSeries = () =>
  useQuery({
    queryKey: [DASHBOARD_KEY, "cash-flow"],
    queryFn: GetCashFlow,
    ...options(SLOW),
  });

export const useTopProducts = () =>
  useQuery({
    queryKey: [DASHBOARD_KEY, "top-products"],
    queryFn: GetTop5Products,
    ...options(SLOW),
  });

export const usePaymentMethodsStats = () =>
  useQuery({
    queryKey: [DASHBOARD_KEY, "payment-methods"],
    queryFn: GetPaymentMethodsStats,
    ...options(SLOW),
  });

export const useStockValue = () =>
  useQuery({
    queryKey: [DASHBOARD_KEY, "stock-value"],
    queryFn: GetTotalInStock,
    ...options(SLOW),
  });

export const useInventoryTurnover = () =>
  useQuery({
    queryKey: [DASHBOARD_KEY, "inventory-turnover"],
    queryFn: GetInventoryTurnover,
    ...options(SLOW),
  });

/** Estado global do dashboard: se algo está buscando e como forçar tudo */
export const useDashboardRefresh = () => {
  const queryClient = useQueryClient();
  const fetching = useIsFetching({ queryKey: [DASHBOARD_KEY] });

  const refresh = useCallback(
    () => queryClient.invalidateQueries({ queryKey: [DASHBOARD_KEY] }),
    [queryClient],
  );

  // Horário do dado mais recente entre os blocos; recalculado sempre que
  // uma busca começa ou termina (useIsFetching dispara o re-render)
  const updatedAt = Math.max(
    0,
    ...queryClient
      .getQueryCache()
      .findAll({ queryKey: [DASHBOARD_KEY] })
      .map((q) => q.state.dataUpdatedAt),
  );

  return { isFetching: fetching > 0, refresh, updatedAt };
};
