import { useCallback } from "react";
import {
  keepPreviousData,
  useIsFetching,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  GetSalesOverviewParams,
  SalePaginationParams,
} from "@/interfaces/sale.interface";
import { GetSales, GetSalesOverview } from "@/service/sale.service";

// Prefixo único: quem invalida ["sales"] (cancelar, alterar, devolver)
// atualiza a lista e os indicadores juntos
const SALES_KEY = "sales";
const INTERVAL = 60_000;

export const useSales = (params: SalePaginationParams) =>
  useQuery({
    queryKey: [SALES_KEY, "list", params],
    queryFn: () => GetSales(params),
    placeholderData: keepPreviousData,
    staleTime: 10_000,
    refetchInterval: INTERVAL,
    refetchOnWindowFocus: true,
  });

export const useSalesOverview = (params: GetSalesOverviewParams) =>
  useQuery({
    queryKey: [SALES_KEY, "overview", params.start_date, params.end_date],
    queryFn: () => GetSalesOverview(params),
    placeholderData: keepPreviousData,
    staleTime: INTERVAL,
    refetchInterval: INTERVAL,
    refetchOnWindowFocus: true,
  });

/** Se a tela está buscando dados e como forçar a atualização */
export const useSalesRefresh = () => {
  const queryClient = useQueryClient();
  const fetching = useIsFetching({ queryKey: [SALES_KEY] });

  const refresh = useCallback(
    () => queryClient.invalidateQueries({ queryKey: [SALES_KEY] }),
    [queryClient],
  );

  return { isFetching: fetching > 0, refresh };
};
