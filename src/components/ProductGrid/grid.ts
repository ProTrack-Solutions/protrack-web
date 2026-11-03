/**
 * Regras da grade de produtos (cor × tamanho) usadas pelas telas de cadastro,
 * estoque, etiquetas, PDV e compras. Cada combinação é um produto normal,
 * agrupado pelo nome do modelo.
 */

/** Chave da célula: cor e tamanho sem diferenciar maiúsculas (mesma regra da API) */
export const cellKey = (color: string, size: string) =>
  `${color.trim().toLowerCase()}|${size.trim().toLowerCase()}`;

export const SIZE_PRESETS = [
  { label: "P M G GG", values: ["P", "M", "G", "GG"] },
  { label: "PP ao XG", values: ["PP", "P", "M", "G", "GG", "XG"] },
  { label: "34 ao 46", values: ["34", "36", "38", "40", "42", "44", "46"] },
  { label: "Infantil 2 ao 16", values: ["2", "4", "6", "8", "10", "12", "14", "16"] },
];

const VARIATION_SEPARATOR = " – ";

/** "Preta – M"; sem cor nem tamanho vira "Produto único" */
export const variationLabel = (color: string, size: string) =>
  [color, size].filter(Boolean).join(VARIATION_SEPARATOR) || "Produto único";

/** Nome que a API gera: "Camiseta – Preta – M" */
export const variationName = (model: string, color: string, size: string) =>
  [model.trim(), color.trim(), size.trim()].filter(Boolean).join(VARIATION_SEPARATOR);

/** Mantém a primeira ocorrência, sem diferenciar maiúsculas */
export const uniqueCI = (values: string[]) =>
  values.filter(
    (v, i) => values.findIndex((x) => x.toLowerCase() === v.toLowerCase()) === i,
  );

// Ordem natural de vestuário; o que não está aqui vai por número ou pela ordem de cadastro
const APPAREL_ORDER = [
  "rn", "pp", "p", "m", "g", "gg", "xg", "xgg", "eg", "egg", "exg",
  "g1", "g2", "g3", "g4", "g5", "u", "único", "unico",
];

/** Ordena tamanhos: PP→XG, depois números em ordem crescente, depois o resto como veio */
export const sortSizes = (sizes: string[]) =>
  sizes
    .map((size, index) => {
      const lower = size.trim().toLowerCase();
      const apparel = APPAREL_ORDER.indexOf(lower);
      const numeric = Number(lower.replace(",", "."));
      const rank =
        apparel >= 0
          ? apparel
          : Number.isFinite(numeric) && lower !== ""
            ? 1000 + numeric
            : 100000 + index;
      return { size, rank };
    })
    .sort((a, b) => a.rank - b.rank)
    .map((s) => s.size);

interface HasColorSize {
  color: string;
  size: string;
}

/** Linhas (cores) e colunas (tamanhos) da matriz a partir das variações */
export function gridAxes<T extends HasColorSize>(variations: T[]) {
  const colors = uniqueCI(variations.map((v) => v.color).filter(Boolean));
  const sizes = sortSizes(uniqueCI(variations.map((v) => v.size).filter(Boolean)));
  const byKey = new Map(variations.map((v) => [cellKey(v.color, v.size), v]));
  return { colors, sizes, byKey };
}

/** Preço mais comum entre as variações (o "preço do modelo"); empate fica com o menor */
export function modePrice(values: number[]) {
  const count = new Map<number, number>();
  for (const v of values) count.set(v, (count.get(v) ?? 0) + 1);
  let best = 0;
  let bestCount = 0;
  for (const [value, c] of count) {
    if (c > bestCount || (c === bestCount && value < best)) {
      best = value;
      bestCount = c;
    }
  }
  return best;
}
