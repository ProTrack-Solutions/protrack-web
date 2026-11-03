import { Pagination } from "./pagination.interface";

export interface Product {
  id: string;
  category_id: string;
  name: string;
  description: string;
  barcode: string;
  quantity: number;
  size: string;
  category_name: string;
  cost_price: number;
  sale_price: number;
  created_by: string;
  updated_by: string;
  deleted_by: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  sell_in_bulk: boolean;
  unit: string;
  total_registered: number;
  total_sold: number;
  /** Grade: modelo e cor da variação (vazios em produto sem grade) */
  model_name?: string;
  color?: string;
}

export interface ProductResponse {
  data: Product[];
  page: number;
  per_page: number;
  total_rows: number;
  total_pages: number;
  total_value_in_stock: number;
  itens_in_stock: number;
  low_itens_in_stock: number;
}

export interface EstoqueStatsProps {
  itensInStock: number;
  lowItensInStock: number;
  productsCount: number;
  totalValueInStock: number;
}

export interface ProductUpdateParams {
  barcode: string;
  category_id: string;
  cost_price: number;
  description: string;
  name: string;
  sale_price: number;
  size: string;
  unit: string;
}

export interface GetTopProductsResponse {
  id: string;
  name: string;
  quantity_sold: number;
}

export const initialFormData: CreateProductParams = {
  name: "",
  description: "",
  category_id: "",
  barcode: "",
  quantity: 0,
  size: "",
  cost_price: 0,
  sale_price: 0,
  not_barcode: false,
  sell_in_bulk: false,
  unit: "UN",
};

export interface CreateProductParams {
  name: string;
  description: string;
  category_id: string;
  barcode?: string;
  quantity?: number;
  size: string;
  cost_price: number;
  sale_price: number;
  sell_in_bulk: boolean;
  unit: string;
  not_barcode: boolean;
}

export interface GetTotalInStockResponse {
  cost_total: number;
}

// ENTRY soma ao estoque (reposição); ADJUSTMENT corrige o saldo e exige motivo
export type StockMovementType = "ENTRY" | "ADJUSTMENT";

export interface CreateStockMovementParams {
  type: StockMovementType;
  quantity: number;
  reason?: string;
}

export interface StockMovement {
  id: string;
  product_id: string;
  type: StockMovementType;
  quantity: number;
  reason: string;
  current_quantity: number;
  created_at: string;
}

// ---------------------------------------------------------------------------
// Grade de produtos: cada combinação cor × tamanho é um produto normal,
// agrupado pelo nome do modelo (model_name).
// ---------------------------------------------------------------------------

/** Linha do estoque agrupado: um modelo de grade ou um produto sem grade */
export interface StockEntry {
  kind: "model" | "product";
  key: string;
  /** Só em produto sem grade */
  product_id: string | null;
  /** Nome do produto ou do modelo */
  name: string;
  model_name: string;
  description: string;
  barcode: string;
  size: string;
  color: string;
  category_id: string;
  category_name: string;
  unit: string;
  sell_in_bulk: boolean;
  variations: number;
  colors: number;
  sizes: number;
  quantity: number;
  low_stock_variations: number;
  min_cost_price: number;
  max_cost_price: number;
  min_sale_price: number;
  max_sale_price: number;
  total_registered: number;
  total_sold: number;
  created_at: string;
}

export interface StockEntriesResponse {
  data: StockEntry[];
  page: number;
  per_page: number;
  total_rows: number;
  total_pages: number;
  /** Total de produtos (variações contam uma a uma) */
  products_count: number;
  total_value_in_stock: number;
  itens_in_stock: number;
  low_itens_in_stock: number;
}

export interface ModelVariation {
  id: string;
  name: string;
  model_name: string;
  color: string;
  size: string;
  barcode: string;
  description: string;
  category_id: string;
  category_name: string;
  unit: string;
  sell_in_bulk: boolean;
  quantity: number;
  cost_price: number;
  sale_price: number;
  total_registered: number;
  total_sold: number;
  created_at: string;
}

export interface GridVariationInput {
  color: string;
  size: string;
  quantity: number;
  /** Vazio gera um código interno */
  barcode?: string;
  /** Omitidos usam o custo/preço do modelo */
  cost_price?: number;
  sale_price?: number;
}

export interface CreateModelParams {
  model_name: string;
  category_id: string;
  description?: string;
  cost_price: number;
  sale_price: number;
  variations: GridVariationInput[];
}

export interface AddVariationsParams {
  cost_price: number;
  sale_price: number;
  variations: GridVariationInput[];
}

export interface UpdateModelParams {
  model_name: string;
  category_id: string;
  description?: string;
  /** Preço por variação; as que ficarem de fora mantêm o atual */
  variations: {
    id: string;
    cost_price: number;
    sale_price: number;
    /** Troca o código (ex.: interno pelo de fábrica); omitido mantém */
    barcode?: string;
  }[];
}

export interface GridStockMovementParams {
  type: StockMovementType;
  reason?: string;
  items: { product_id: string; quantity: number }[];
}

export interface GroupProductsParams {
  model_name: string;
  /** Obrigatória para modelo novo; num modelo existente vale a dele */
  category_id?: string;
  items: { product_id: string; color: string; size: string }[];
}
