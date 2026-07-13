import { ListBillsCategoriesResponse } from "@/interfaces/bills-categories.interface";
import { api } from "./api";

export const ListBillsCategories = async (): Promise<
  ListBillsCategoriesResponse[]
> => {
  const response =
    await api.get<ListBillsCategoriesResponse[]>("/bill-categories");
  return response.data;
};

export const DeleteBillCategory = async (billId: string): Promise<void> => {
  await api.delete(`/bill-categories/${billId}`);
};
