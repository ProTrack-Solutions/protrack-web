import { ListVendorsResponse } from "@/interfaces/vendors.interface";
import { api } from "./api";

export const ListVendorsIsActive = async (): Promise<ListVendorsResponse[]> => {
  const response = await api.get<ListVendorsResponse[]>(
    "/vendors/list/is-active",
  );
  return response.data;
};
