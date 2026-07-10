import { useQuery } from "@tanstack/react-query";
import { ListBillsCategories } from "@/service/bills-categories.service";

export const useBillsCategories = () => {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["bills-categories"],
    queryFn: () => ListBillsCategories(),

    refetchInterval: 10000,
    refetchOnWindowFocus: true,
  });

  return {
    billsCategories: data,
    loading: isLoading,
    error: isError
      ? "Erro ao carregar os produtos. Por favor, tente novamente."
      : null,
    refetch,
  };
};
