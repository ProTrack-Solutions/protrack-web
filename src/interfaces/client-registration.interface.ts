import { Gender } from "@/enum/gender.enum";

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
