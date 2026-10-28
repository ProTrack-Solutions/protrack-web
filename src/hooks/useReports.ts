import { useQuery } from "@tanstack/react-query";
import { GetReportParams } from "@/interfaces/reports.interface";
import { GetReport } from "@/service/reports.service";

// A API agrega tudo no banco; o relatório é um retrato, então não precisa de
// refetch automático — o usuário atualiza pelo botão quando quiser.
export const useReport = (params: GetReportParams | null) =>
  useQuery({
    queryKey: ["reports", params?.type, params?.start_date, params?.end_date],
    queryFn: () => GetReport(params!),
    enabled: params !== null,
    // Ao trocar só o período, mantém a tabela anterior na tela até chegar a nova;
    // ao trocar de relatório, não (as colunas são outras)
    placeholderData: (previous) =>
      previous?.type === params?.type ? previous : undefined,
    staleTime: 5 * 60_000,
    refetchOnWindowFocus: false,
    retry: 1,
  });
