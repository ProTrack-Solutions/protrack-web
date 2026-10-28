import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { ListReturnsParams } from "@/interfaces/returns.interface";
import {
  GetCustomerCredit,
  GetReturn,
  GetReturnableSale,
  ListReturns,
  SearchSalesForReturn,
} from "@/service/returns.service";

export const RETURNS_KEY = "returns";
export const CUSTOMER_CREDIT_KEY = "customer-credit";

export const useReturns = (params: ListReturnsParams) =>
  useQuery({
    queryKey: [RETURNS_KEY, "list", params],
    queryFn: () => ListReturns(params),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  });

export const useReturn = (id: string) =>
  useQuery({
    queryKey: [RETURNS_KEY, "detail", id],
    queryFn: () => GetReturn(id),
    enabled: !!id,
    retry: 1,
  });

export const useSalesForReturn = (search: string, page: number) =>
  useQuery({
    queryKey: [RETURNS_KEY, "sales", search, page],
    queryFn: () => SearchSalesForReturn({ search, page, per_page: 8 }),
    placeholderData: keepPreviousData,
  });

export const useReturnableSale = (saleId: string) =>
  useQuery({
    queryKey: [RETURNS_KEY, "sale", saleId],
    queryFn: () => GetReturnableSale(saleId),
    enabled: !!saleId,
    retry: 1,
  });

/** Saldo do vale-troca; só busca com cliente escolhido */
export const useCustomerCredit = (customerId?: string) =>
  useQuery({
    queryKey: [CUSTOMER_CREDIT_KEY, customerId],
    queryFn: () => GetCustomerCredit(customerId!),
    enabled: !!customerId,
    staleTime: 15_000,
  });
