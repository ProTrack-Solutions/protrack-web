import { useQuery } from "@tanstack/react-query";
import { ListUsers } from "@/service/user.service";

export const useUsers = () => {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["users"],
    queryFn: () => ListUsers(),
    refetchInterval: 10000,
    refetchOnWindowFocus: true,
  });

  return {
    users: data,
    loading: isLoading,
    error: isError
      ? "Erro ao carregar usuários. Por favor, tente novamente."
      : null,
    refetch,
  };
};
