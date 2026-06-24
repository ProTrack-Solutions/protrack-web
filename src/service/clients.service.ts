import { ClienteFormData } from "@/@types/client-registration.type";
import { api } from "./api";
import { ClientResponse } from "@/@types/client.type";

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
