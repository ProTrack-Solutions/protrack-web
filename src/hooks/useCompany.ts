import { useQuery } from "@tanstack/react-query";
import { GetCompany } from "@/service/companies.service";

export const useCompany = () => {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["company"],
    queryFn: () => GetCompany(),

    refetchInterval: 10000,
    refetchOnWindowFocus: true,
  });

  return {
    company: data,
    loading: isLoading,
    error: isError
      ? "Erro ao carregar dados da empresa. Por favor, tente novamente."
      : null,
    refetch,
  };
};
