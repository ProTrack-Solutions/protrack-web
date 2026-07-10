import { useQuery } from "@tanstack/react-query";
import { ListVendorsIsActive } from "@/service/vendors.service";

export const useVendors = () => {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["vendors"],
    queryFn: async () => {
      const [vendorsIsActive] = await Promise.all([ListVendorsIsActive()]);

      return {
        vendorsIsActive,
      };
    },
    refetchInterval: 10000,
    refetchOnWindowFocus: true,
  });

  return {
    vendorsIsActive: data?.vendorsIsActive,
    loading: isLoading,
    error: isError
      ? "Erro ao carregar dados do dashboard. Por favor, tente novamente."
      : null,
    refetch,
  };
};
