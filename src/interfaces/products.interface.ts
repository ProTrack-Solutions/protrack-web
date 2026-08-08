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
  quantity: number;
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
