import {
  keepPreviousData,
  useInfiniteQuery,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useCallback } from "react";
import {
  ListPurchaseOrdersParams,
  PurchaseOrderDetail,
} from "@/interfaces/purchases.interface";
import {
  GetPurchaseOrder,
  ListCatalogCategories,
  ListModelVariations,
  ListPurchaseOrders,
  SearchCatalogProducts,
} from "@/service/purchases.service";

export const PURCHASES_KEY = "purchases";

export const usePurchaseOrders = (params: ListPurchaseOrdersParams) =>
  useQuery({
    queryKey: [PURCHASES_KEY, "list", params],
    queryFn: () => ListPurchaseOrders(params),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
    refetchOnWindowFocus: true,
  });

export const usePurchaseOrder = (id: string) =>
  useQuery({
    queryKey: [PURCHASES_KEY, "order", id],
    queryFn: () => GetPurchaseOrder(id),
    enabled: !!id,
    retry: 1,
  });

/**
 * Toda ação no pedido devolve o pedido atualizado: grava direto no cache do
 * detalhe e invalida a listagem e o que a compra afeta (estoque e contas a pagar).
 */
export const usePurchaseOrderUpdated = () => {
  const queryClient = useQueryClient();

  return useCallback(
    (order: PurchaseOrderDetail) => {
      queryClient.setQueryData([PURCHASES_KEY, "order", order.id], order);
      queryClient.invalidateQueries({ queryKey: [PURCHASES_KEY, "list"] });
      queryClient.invalidateQueries({ queryKey: ["products-stock"] });
      queryClient.invalidateQueries({ queryKey: ["products-select"] });
      queryClient.invalidateQueries({ queryKey: ["bills-payable"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
    [queryClient],
  );
};

/** Busca de produtos do pedido (rota de Compras: não exige o módulo Estoque) */
export const useCatalogProducts = (search: string) => {
  const query = useInfiniteQuery({
    queryKey: [PURCHASES_KEY, "catalog", search],
    queryFn: ({ pageParam }) =>
      SearchCatalogProducts({ search, page: pageParam, per_page: 20 }),
    initialPageParam: 1,
    getNextPageParam: (last) =>
      last.page < last.total_pages ? last.page + 1 : undefined,
  });

  return {
    products: query.data?.pages.flatMap((p) => p.products) ?? [],
    models: query.data?.pages[0]?.models ?? [],
    loading: query.isLoading,
    fetchNextPage: query.fetchNextPage,
    hasNextPage: !!query.hasNextPage,
    isFetchingNextPage: query.isFetchingNextPage,
  };
};

export const useModelVariations = (modelName: string | null) =>
  useQuery({
    queryKey: [PURCHASES_KEY, "catalog", "model", modelName],
    queryFn: () => ListModelVariations(modelName!),
    enabled: !!modelName,
  });

export const useCatalogCategories = () =>
  useQuery({
    queryKey: [PURCHASES_KEY, "catalog", "categories"],
    queryFn: ListCatalogCategories,
    staleTime: 5 * 60_000,
  });
