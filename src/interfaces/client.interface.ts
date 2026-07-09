import { Gender } from "@/enum/gender.enum";

export interface Client {
  id: string;
  company_id: string;
  full_name: string;
  birth_date: Date;
  cpf: string;
  rg: string;
  marital_status: string;
  gender: Gender;
  whatsapp: string;
  mobile_phone: string;
  home_phone: string;
  email: string;
  address_street: string;
  address_number: string;
  address_complement: string;
  address_neighborhood: string;
  address_city: string;
  address_state: string;
  address_zipcode: string;
  address_country: string;
  balance_due: number;
  created_by: string;
  updated_by: string;
  deleted_by?: string;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
}

export interface ClientResponse {
  data: Client[];
  page: number;
  per_page: number;
  total_rows: number;
  total_pages: number;
}

export interface UpdatedClient {
  full_name: string;
  birth_date: string;
  cpf: string;
  rg: string;
  marital_status: string;
  gender: Gender;
  whatsapp: string;
  mobile_phone: string;
  home_phone: string;
  email: string;
  address_street: string;
  address_number: string;
  address_complement: string;
  address_neighborhood: string;
  address_city: string;
  address_state: string;
  address_zipcode: string;
  address_country: string;
  balance_due: number;
}

export interface ClienteFormData {
  full_name: string;
  birth_date: string;
  cpf: string;
  rg: string;
  marital_status: string;
  gender: Gender;
  whatsapp: string;
  mobile_phone: string;
  home_phone: string;
  email: string;
  address_street: string;
  address_number: string;
  address_complement: string;
  address_neighborhood: string;
  address_city: string;
  address_state: string;
  address_zipcode: string;
  address_country: string;
}

export const initialData: ClienteFormData = {
  full_name: "",
  birth_date: "",
  cpf: "",
  rg: "",
  marital_status: "",
  gender: Gender.GenderNotSay,
  whatsapp: "",
  mobile_phone: "",
  home_phone: "",
  email: "",
  address_street: "",
  address_number: "",
  address_complement: "",
  address_neighborhood: "",
  address_city: "",
  address_state: "",
  address_zipcode: "",
  address_country: "Brasil",
};
