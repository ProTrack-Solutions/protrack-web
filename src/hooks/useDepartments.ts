import { useQuery } from "@tanstack/react-query";
import { GetDepartments } from "@/service/departments.service";

export const useDepartments = () => {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["departments"],
    queryFn: async () => {
      const [departments] = await Promise.all([GetDepartments()]);

      return {
        departments,
      };
    },
    refetchInterval: 10000,
    refetchOnWindowFocus: true,
  });

  return {
    departments: data?.departments,
    loading: isLoading,
    error: isError
      ? "Erro ao carregar dados do dashboard. Por favor, tente novamente."
      : null,
    refetch,
  };
};
