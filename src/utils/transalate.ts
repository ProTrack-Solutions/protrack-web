import { GetSummaryMonthResponse } from "@/interfaces/cash-flow.interface";

export type TipoVisualizacao = "diario" | "semanal" | "mensal";
export type VisualizationTypeEn = "day" | "week" | "month";

export function translateVisualizacao(
  tipo: TipoVisualizacao,
): VisualizationTypeEn {
  const translations: Record<TipoVisualizacao, VisualizationTypeEn> = {
    diario: "day",
    semanal: "week",
    mensal: "month",
  };

  return translations[tipo];
}

const monthTranslations: Record<string, string> = {
  "current month": "Mês atual",
  "last month": "Mês passado",
  "last year": "Ano passado",
};

export function translateMount(mount: string): string {
  return monthTranslations[mount] || mount;
}
