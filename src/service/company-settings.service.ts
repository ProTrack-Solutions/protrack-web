import {
  CompanySettingsResponse,
  UpsetCompanySettingsRequest,
} from "@/interfaces/company-settings.interface";
import { api } from "./api";

export const UpsetCompanySettings = async (
  params: UpsetCompanySettingsRequest,
): Promise<void> => {
  await api.post("/company-settings", params);
};

export const ListCompanySettings = async (): Promise<
  CompanySettingsResponse[]
> => {
  const response =
    await api.get<CompanySettingsResponse[]>("/company-settings");
  return response.data;
};
