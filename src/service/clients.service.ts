import {
  ClienteFormData,
  ClientResponse,
  UpdatedClient,
} from "@/interfaces/client.interface";
import { api } from "./api";
import { Pagination } from "@/interfaces/pagination.interface";

export const CreateClient = async (params: ClienteFormData): Promise<void> => {
  const response = await api.post("/customers", params);
  return response.data;
};

export const GetClient = async (
  pagination: Pagination,
): Promise<ClientResponse> => {
  const response = await api.get("/customers/list", {
    headers: {
      Page: pagination.Page,
      PerPage: pagination.PerPage,
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
