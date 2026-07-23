import { ConnectionState } from "@/service/whatsapp.service";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useState } from "react";

export const useWhatsApp = () => {
  const [pollingEnabled, setPollingEnabled] = useState(true);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["whatsapp"],
    queryFn: async () => {
      const [connectionsState] = await Promise.all([ConnectionState()]);

      return {
        connectionsState,
      };
    },
    refetchInterval: pollingEnabled ? 5000 : false,
    refetchOnWindowFocus: true,
  });

  const pausePolling = useCallback((ms: number) => {
    setPollingEnabled(false);
    setTimeout(() => setPollingEnabled(true), ms);
  }, []);

  return {
    connectionsState: data?.connectionsState,
    loading: isLoading,
    error: isError
      ? "Erro ao carregar dados do dashboard. Por favor, tente novamente."
      : null,
    refetch,
    pausePolling,
  };
};
