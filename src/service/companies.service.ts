import {
  CompanyResponse,
  CreateCompanyParams,
} from "@/interfaces/companies.interface";
import { api } from "./api";

export const CreateCompany = async (
  params: CreateCompanyParams,
): Promise<void> => {
  await api.post("/companies", params);
};

export const GetCompany = async (): Promise<CompanyResponse> => {
  const response = await api.get<CompanyResponse>("/companies/me");
  return response.data;
};
