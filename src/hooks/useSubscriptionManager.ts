import { useQuery } from "@tanstack/react-query";
import { GetUsageMenssages } from "@/service/subscription-manager.service";
import { ListTemplates } from "@/service/meta-whatsapp.service";

export const useConfigSettings = () => {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["config-settings"],
    queryFn: async () => {
      const [usageMenssages, templates] = await Promise.all([
        GetUsageMenssages(),
        ListTemplates(),
      ]);

      return {
        usageMenssages,
        templates,
      };
    },

    refetchInterval: 10000,
    refetchOnWindowFocus: true,
  });

  return {
    usageMenssages: data?.usageMenssages,
    templates: data?.templates,
    loading: isLoading,
    error: isError
      ? "Erro ao carregar a assinatura. Por favor, tente novamente."
      : null,
    refetch,
  };
};
