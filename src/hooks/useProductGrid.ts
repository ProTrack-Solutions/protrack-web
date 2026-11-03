import { keepPreviousData, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { Pagination } from "@/interfaces/pagination.interface";
import { GetModelVariations, GetStockEntries } from "@/service/products.service";

// Mesmo prefixo do estoque: as invalidações que já existem ("products-stock")
// também atualizam a grade
export const STOCK_KEY = "products-stock";

/** Estoque agrupado por modelo */
export const useStockEntries = (pagination: Pagination) =>
  useQuery({
    queryKey: [STOCK_KEY, "entries", pagination],
    queryFn: () => GetStockEntries(pagination),
    placeholderData: keepPreviousData,
    refetchInterval: 10000,
    refetchOnWindowFocus: true,
  });

/** Variações de um modelo; null não busca */
export const useModelVariations = (modelName: string | null) =>
  useQuery({
    queryKey: [STOCK_KEY, "model", modelName?.toLowerCase()],
    queryFn: () => GetModelVariations(modelName!),
    enabled: !!modelName,
  });

/** Depois de mexer na grade: estoque, seleção do PDV, catálogo de compras e dashboard */
export const useInvalidateGrid = () => {
  const queryClient = useQueryClient();
  return useCallback(() => {
    queryClient.invalidateQueries({ queryKey: [STOCK_KEY] });
    queryClient.invalidateQueries({ queryKey: ["products-select"] });
    queryClient.invalidateQueries({ queryKey: ["purchases", "catalog"] });
    queryClient.invalidateQueries({ queryKey: ["dashboard"] });
  }, [queryClient]);
};
