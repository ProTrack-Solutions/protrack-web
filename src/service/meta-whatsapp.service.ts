import { ListTemplatesResponse } from "@/interfaces/meta-whatsapp.interface";
import { api } from "./api";

export const ListTemplates = async (): Promise<ListTemplatesResponse[]> => {
  const response = await api.get<ListTemplatesResponse[]>(
    "/meta-whatsapp/list-templates",
  );
  return response.data;
};
