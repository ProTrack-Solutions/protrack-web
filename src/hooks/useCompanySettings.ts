import { useQuery } from "@tanstack/react-query";
import { ListCompanySettings } from "@/service/company-settings.service";

export const useCompanySettings = () => {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["company-settings"],
    queryFn: () => ListCompanySettings(),

    refetchInterval: 10000,
    refetchOnWindowFocus: true,
  });

  return {
    companySettings: data,
    loading: isLoading,
    error: isError
      ? "Erro ao carregar dados da empresa. Por favor, tente novamente."
      : null,
    refetch,
  };
};
