import { keepPreviousData, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { BrowseCustomersParams } from "@/interfaces/customer-profile.interface";
import {
  BrowseCustomers,
  GetCustomerOverview,
  GetCustomerProfile,
} from "@/service/customer-profile.service";

export const CUSTOMERS_KEY = "customers-screen";

export const useCustomerOverview = () =>
  useQuery({
    queryKey: [CUSTOMERS_KEY, "overview"],
    queryFn: GetCustomerOverview,
    staleTime: 30_000,
  });

export const useBrowseCustomers = (params: BrowseCustomersParams) =>
  useQuery({
    queryKey: [CUSTOMERS_KEY, "browse", params],
    queryFn: () => BrowseCustomers(params),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  });

export const useCustomerProfile = (id: string) =>
  useQuery({
    queryKey: [CUSTOMERS_KEY, "profile", id],
    queryFn: () => GetCustomerProfile(id),
    enabled: !!id,
    retry: 1,
  });

/** Recarrega a tela de clientes e as listas que usam o cadastro (venda, seleção) */
export const useCustomersChanged = () => {
  const queryClient = useQueryClient();
  return useCallback(() => {
    queryClient.invalidateQueries({ queryKey: [CUSTOMERS_KEY] });
    queryClient.invalidateQueries({ queryKey: ["clients"] });
    queryClient.invalidateQueries({ queryKey: ["clients-select"] });
  }, [queryClient]);
};
