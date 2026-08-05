type Unit = "KG" | "G" | "L" | "ML" | string;
export function getQuantityStyle(quantity?: number): string {
  if (quantity === undefined || quantity === null) {
    return "bg-slate-50 text-slate-600 border-slate-200 dark:bg-slate-500/10 dark:text-slate-400";
  }

  if (quantity >= 10) {
    return "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400";
  }

  if (quantity >= 5) {
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
