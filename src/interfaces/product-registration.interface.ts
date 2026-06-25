export const initialFormData: CreateProductParams = {
  name: "",
  description: "",
  category_id: "",
  barcode: "",
  quantity: 0,
  size: "",
  cost_price: 0,
  sale_price: 0,
};

export interface CreateProductParams {
  name: string;
  description: string;
  category_id: string;
  barcode: string;
  quantity: number;
  size: string;
  cost_price: number;
  sale_price: number;
}
