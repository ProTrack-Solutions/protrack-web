import {
  keepPreviousData,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useCallback } from "react";
import { FiscalModel } from "@/interfaces/fiscal.interface";
import {
  GetFiscalCategories,
  GetFiscalDocuments,
  GetFiscalProfile,
  GetFiscalSettings,
  GetSaleFiscalDocument,
  GetSalesFiscalDocuments,
  GetTaxProfiles,
} from "@/service/fiscal.service";

export const FISCAL_KEY = "fiscal";

export const useFiscalSettings = (enabled = true) =>
  useQuery({
    queryKey: [FISCAL_KEY, "settings"],
    queryFn: GetFiscalSettings,
    enabled,
    staleTime: 30_000,
  });

export const useFiscalProfile = (enabled: boolean) =>
  useQuery({
    queryKey: [FISCAL_KEY, "profile"],
    queryFn: GetFiscalProfile,
    enabled,
    retry: false,
  });

export const useTaxProfiles = (enabled = true) =>
  useQuery({
    queryKey: [FISCAL_KEY, "tax-profiles"],
    queryFn: GetTaxProfiles,
    enabled,
  });

export const useFiscalCategories = (enabled = true) =>
  useQuery({
    queryKey: [FISCAL_KEY, "categories"],
    queryFn: GetFiscalCategories,
    enabled,
  });

export const useFiscalDocuments = (params: {
  status?: string;
  model?: FiscalModel;
  source?: "sale" | "manual";
  problems?: boolean;
  page: number;
  per_page: number;
}) =>
  useQuery({
    queryKey: [FISCAL_KEY, "documents", params],
    queryFn: () => GetFiscalDocuments(params),
    placeholderData: keepPreviousData,
    // Notas pendentes mudam sozinhas (worker/webhook)
    refetchInterval: 15_000,
  });

export const useSaleFiscalDocument = (saleId: string | null) =>
  useQuery({
    queryKey: [FISCAL_KEY, "sale", saleId],
    queryFn: () => GetSaleFiscalDocument(saleId!),
    enabled: !!saleId,
    // Enquanto a SEFAZ processa, consulta de novo
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      return status === "PENDING" || status === "PROCESSING" ? 5_000 : false;
    },
  });

/** NFC-e das vendas da página (lista de vendas) */
export const useSalesFiscalDocuments = (saleIds: string[], enabled = true) =>
  useQuery({
    queryKey: [FISCAL_KEY, "sales", saleIds],
    queryFn: () => GetSalesFiscalDocuments(saleIds),
    enabled: enabled && saleIds.length > 0,
    placeholderData: keepPreviousData,
    // Pendentes mudam sozinhas
    refetchInterval: (query) =>
      Object.values(query.state.data ?? {}).some(
        (d) => d.status === "PENDING" || d.status === "PROCESSING",
      )
        ? 5_000
        : false,
  });

export const useInvalidateFiscal = () => {
  const queryClient = useQueryClient();
  return useCallback(
    () => queryClient.invalidateQueries({ queryKey: [FISCAL_KEY] }),
    [queryClient],
  );
};
