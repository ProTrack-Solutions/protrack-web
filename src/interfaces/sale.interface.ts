import { PaymentMethod } from "@/enum/methodPayments";

export const initialSaleFormData: CreateSaleParams = {
  customer_id: "",
  discount_amount: "",
  due_days: 0,
  payment_method: PaymentMethod.Cash,
  installments_count: 0,
  items: [],
  prohibited: 0,
};

export interface CreateSaleParams {
  customer_id: string;
  discount_amount: string;
  due_days: number;
  payment_method: PaymentMethod;
  installments_count: number;
  items: CreateSaleItemParams[];
  prohibited: number;
}

interface CreateSaleItemParams {
  product_id: string;
  quantity: number;
}

export interface UpdateSaleParams {
  discount_amount: number;
  due_days: number;
  payment_method: PaymentMethod;
  installments_count: number;
  prohibited: number;
}
