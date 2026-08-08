import { useQuery } from "@tanstack/react-query";
import { GetSubscriptionDetails } from "@/service/subscription-manager.service";

export const useSubscription = () => {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["subscription"],
    queryFn: () => GetSubscriptionDetails(),

    refetchInterval: 10000,
    refetchOnWindowFocus: true,
  });

  return {
    subscription: data,
    loading: isLoading,
    error: isError
      ? "Erro ao carregar a assinatura. Por favor, tente novamente."
      : null,
    refetch,
  };
};
