import { useMemo } from "react";

interface UseMargemResult {
  margemValor: number;
  margemPercent: number;
  margemTone: string;
}

export function useMargem(
  precoCusto: string,
  precoVenda: string,
): UseMargemResult {
  return useMemo(() => {
    const custo = parseFloat(precoCusto) || 0;
    const venda = parseFloat(precoVenda) || 0;
    const margemValor = venda - custo;
    const margemPercent = custo > 0 ? (margemValor / custo) * 100 : 0;

    const margemTone =
      margemPercent >= 50
        ? "from-emerald-500 to-teal-600"
        : margemPercent >= 20
          ? "from-blue-500 to-indigo-600"
          : margemPercent > 0
            ? "from-amber-500 to-orange-500"
            : "from-rose-500 to-rose-600";

    return { margemValor, margemPercent, margemTone };
  }, [precoCusto, precoVenda]);
}
