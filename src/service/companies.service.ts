import { CreateCompanyParams } from "@/interfaces/companies.interface";
import { api } from "./api";

export const CreateCompany = async (
  params: CreateCompanyParams,
): Promise<void> => {
  await api.post("/companies", params);
};
