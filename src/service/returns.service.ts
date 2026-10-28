import {
  CreateReturnParams,
  CustomerCredit,
  ListReturnsParams,
  ListReturnsResponse,
  ReturnDetail,
  ReturnableSale,
  SaleSearchResponse,
} from "@/interfaces/returns.interface";
import { api } from "./api";

export const ListReturns = async (
  params: ListReturnsParams,
): Promise<ListReturnsResponse> => {
  const response = await api.get<ListReturnsResponse>("/returns", { params });
  return response.data;
};

export const GetReturn = async (id: string): Promise<ReturnDetail> => {
  const response = await api.get<ReturnDetail>(`/returns/${id}`);
  return response.data;
};

export const CreateReturn = async (
  params: CreateReturnParams,
): Promise<ReturnDetail> => {
  const response = await api.post<ReturnDetail>("/returns", params);
  return response.data;
};

export const SearchSalesForReturn = async (params: {
  search?: string;
  page?: number;
  per_page?: number;
}): Promise<SaleSearchResponse> => {
  const response = await api.get<SaleSearchResponse>("/returns/sales", {
    params,
  });
  return response.data;
};

export const GetReturnableSale = async (
  saleId: string,
): Promise<ReturnableSale> => {
  const response = await api.get<ReturnableSale>(`/returns/sales/${saleId}`);
  return response.data;
};

export const GetCustomerCredit = async (
  customerId: string,
): Promise<CustomerCredit> => {
  const response = await api.get<CustomerCredit>(
    `/returns/customers/${customerId}/credit`,
  );
  return response.data;
};
