import {
  ClienteFormData,
  ClientResponse,
  ClientsPaginationParams,
  UpdatedClient,
} from "@/interfaces/client.interface";
import { api } from "./api";

export const CreateClient = async (params: ClienteFormData): Promise<void> => {
  const response = await api.post("/customers", params);
  return response.data;
};

export const GetClient = async (
  pagination: ClientsPaginationParams,
): Promise<ClientResponse> => {
  const response = await api.get("/customers/list", {
    params: {
      page: pagination.Page,
      perPage: pagination.PerPage,
      search: pagination.Search,
      startDate: pagination.StartDate,
      endDate: pagination.EndDate,
      orderBy: pagination.OrderBy,
      status: pagination.Status,
    },
  });

  return response.data;
};

export const UpdateClient = async (
  clientId: string,
  params: UpdatedClient,
): Promise<void> => {
  const response = await api.put(`/customers/${clientId}`, params);
  return response.data;
};

export const DeleteClient = async (clientId: string) => {
  const response = await api.delete(`/customers/${clientId}`);
  return response.data;
};
