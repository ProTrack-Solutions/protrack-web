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
