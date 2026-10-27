type Unit = "KG" | "G" | "L" | "ML" | string;

/** Limite de estoque baixo quando a empresa não configurou nenhum */
export const DEFAULT_LOW_STOCK = 5;
/** O estoque médio vai até o dobro do limite de estoque baixo */
export const MEDIUM_STOCK_FACTOR = 2;

/** Abaixo de lowStock é baixo; até o dobro é médio; acima disso, normal */
export function getStockLevels(lowStock: number) {
  return { low: lowStock, medium: lowStock * MEDIUM_STOCK_FACTOR };
}

export function getQuantityStyle(
  quantity?: number,
  lowStock = DEFAULT_LOW_STOCK,
): string {
  const levels = getStockLevels(lowStock);

  if (quantity === undefined || quantity === null) {
    return "bg-slate-50 text-slate-600 border-slate-200 dark:bg-slate-500/10 dark:text-slate-400";
  }

  if (quantity >= levels.medium) {
    return "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400";
  }

  if (quantity >= levels.low) {
    return "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400";
  }

  return "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400";
}

export function getUnitBadgeStyle(unit?: Unit): string {
  const upperUnit = unit?.toUpperCase();

  switch (upperUnit) {
    case "KG":
    case "G":
      // Estilo para Peso (Roxo/Purple)
      return "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-500/10 dark:text-purple-400";

    case "L":
    case "ML":
      // Estilo para Volume (Azul/Sky)
      return "bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-500/10 dark:text-sky-400";

    case "UN":
    case "CX":
    case "PCT":
    default:
      // Estilo para Unidades Padrão (Cinza/Slate)
      return "bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-500/10 dark:text-slate-400";
  }
}
