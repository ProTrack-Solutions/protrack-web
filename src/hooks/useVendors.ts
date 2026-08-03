import { useQuery } from "@tanstack/react-query";
import { ListVendors, ListVendorsIsActive } from "@/service/vendors.service";

export const useVendors = () => {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["vendors"],
    queryFn: async () => {
      const [vendorsIsActive, vendors] = await Promise.all([
        ListVendorsIsActive(),
        ListVendors(),
      ]);

      return {
        vendorsIsActive,
        vendors,
      };
    },
    refetchInterval: 10000,
    refetchOnWindowFocus: true,
  });

  return {
    vendorsIsActive: data?.vendorsIsActive,
    vendors: data?.vendors,
    loading: isLoading,
    error: isError
      ? "Erro ao carregar dados do dashboard. Por favor, tente novamente."
      : null,
    refetch,
  };
};
