import { ClienteFormData } from "@/interfaces/client-registration.interface";
import { ClientResponse } from "@/interfaces/client.interface";
import { api } from "./api";

export const CreateClient = async (params: ClienteFormData): Promise<void> => {
  const response = await api.post("/customers", params);
  return response.data;
};

export const GetClient = async (): Promise<ClientResponse> => {
  const response = await api.get("/customers/list", {
    headers: {
      Page: 1,
      PerPage: 10,
    },
  });

  return response.data;
};
