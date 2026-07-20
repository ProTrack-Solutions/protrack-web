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
