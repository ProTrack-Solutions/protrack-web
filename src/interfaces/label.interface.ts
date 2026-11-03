export interface GenerateLabelParams {
  product_id: string;
  /** Quantidade de etiquetas; omitido imprime uma por peça em estoque */
  quantity?: number;
}
