import { useQuery } from "@tanstack/react-query";

import { GetPlans } from "@/service/plans.service";

export const usePlans = () => {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["plans"],
    queryFn: () => GetPlans(),

    refetchInterval: 10000,
    refetchOnWindowFocus: true,
  });

  return {
    plans: data,
    loading: isLoading,
    error: isError
      ? "Erro ao carregar os produtos. Por favor, tente novamente."
      : null,
    refetch,
  };
};
