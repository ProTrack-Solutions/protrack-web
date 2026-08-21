import { CompanySettings } from "@/enum/company-settings.enum";

export interface UpsetCompanySettingsRequest {
  key: CompanySettings;
  value: string | number | boolean;
}

export interface CompanySettingsResponse {
  company_id: string;
  created_at: string;
  id: string;
  key: CompanySettings;
  updated_at: string;
  value: string | number | boolean;
}
