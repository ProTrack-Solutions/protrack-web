import {
  keepPreviousData,
  useIsFetching,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useCallback } from "react";
import { GetCashFlowOverviewParams } from "@/interfaces/cash-flow.interface";
import { GetCashFlowOverview } from "@/service/cash-flow.service";

const CASH_FLOW_KEY = "cash-flow";
const INTERVAL = 60_000;

// Uma única chamada traz a tela inteira (a API agrega tudo no banco).
// keepPreviousData mantém os números antigos na tela ao trocar o filtro,
// em vez de piscar skeletons a cada clique.
export const useCashFlowOverview = (params: GetCashFlowOverviewParams) =>
  useQuery({
    queryKey: [
      CASH_FLOW_KEY,
      "overview",
      params.period,
      params.quantity,
      params.forecast_days,
    ],
    queryFn: () => GetCashFlowOverview(params),
    placeholderData: keepPreviousData,
    staleTime: INTERVAL,
    refetchInterval: INTERVAL,
    refetchOnWindowFocus: true,
  });

/** Se a tela está buscando dados e como forçar a atualização */
export const useCashFlowRefresh = () => {
  const queryClient = useQueryClient();
  const fetching = useIsFetching({ queryKey: [CASH_FLOW_KEY] });

  const refresh = useCallback(
    () => queryClient.invalidateQueries({ queryKey: [CASH_FLOW_KEY] }),
    [queryClient],
  );

  return { isFetching: fetching > 0, refresh };
};
