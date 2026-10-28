import { useQuery } from "@tanstack/react-query";
import { ListCompanySettings } from "@/service/company-settings.service";
import { CompanySettings } from "@/enum/company-settings.enum";
import { DEFAULT_LOW_STOCK } from "@/utils/productsQuantity";

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

/** Limite de estoque baixo configurado pela empresa (mesmo padrão da API) */
export const useLowStockThreshold = () => {
  const { companySettings } = useCompanySettings();
  const value = companySettings?.find(
    (cs) => cs.key === CompanySettings.LowStock,
  )?.value;
  return typeof value === "number" && value > 0 ? value : DEFAULT_LOW_STOCK;
};

/** Prazo de troca em dias (0 = sem prazo); padrão de 30 dias, igual à API */
export const DEFAULT_RETURN_WINDOW_DAYS = 30;

export const useReturnWindowDays = () => {
  const { companySettings } = useCompanySettings();
  const value = companySettings?.find(
    (cs) => cs.key === CompanySettings.ReturnWindowDays,
  )?.value;
  const days = typeof value === "string" ? Number(value) : value;
  return typeof days === "number" && Number.isInteger(days) && days >= 0
    ? days
    : DEFAULT_RETURN_WINDOW_DAYS;
};
