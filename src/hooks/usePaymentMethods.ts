import { useQuery } from "@tanstack/react-query";
import { ListPaymentMethods } from "@/service/payment-methods.service";

export const usePaymentMethods = () => {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["payment-methods"],
    queryFn: () => ListPaymentMethods(),

    refetchInterval: 10000,
    refetchOnWindowFocus: true,
  });

  return {
    paymentMethods: data,
    loading: isLoading,
    error: isError
      ? "Erro ao carregar os produtos. Por favor, tente novamente."
      : null,
    refetch,
  };
};
