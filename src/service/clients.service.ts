import { ClienteFormData } from "@/@types/client-registration.type";
import { api } from "./api";

export const CreateClient = async (params: ClienteFormData): Promise<void> => {
  const response = await api.post("/customers", params);
  return response.data;
};
