import { useQuery } from "@tanstack/react-query";
import { Me } from "@/service/user.service";

export const useMe = () => {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["me"],
    queryFn: () => Me(),

    refetchInterval: 10000,
    refetchOnWindowFocus: true,
  });

  return {
    user: data,
    loading: isLoading,
    error: isError
      ? "Erro ao carregar os clientes. Por favor, tente novamente."
      : null,
    refetch,
  };
};
