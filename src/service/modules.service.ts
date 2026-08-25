import { ModulesResponse } from "@/interfaces/modules.interface";
import { api } from "./api";

export const ListModules = async (): Promise<ModulesResponse[]> => {
  const response = await api.get<ModulesResponse[]>("/modules/list");
  return response.data;
};
