import { useQuery } from "@tanstack/react-query";
import { ListModules } from "@/service/modules.service";

export const useModules = () => {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["modules"],
    queryFn: () => ListModules(),

    refetchInterval: 10000,
    refetchOnWindowFocus: true,
  });

  return {
    modules: data,
    loading: isLoading,
    error: isError
      ? "Erro ao carregar os produtos. Por favor, tente novamente."
      : null,
    refetch,
  };
};
