import { Gender } from "@/enum/gender.enum";
import { Client } from "@/interfaces/client.interface";
import { CustomerProfile } from "@/interfaces/customer-profile.interface";

/** Monta o cadastro no formato do diálogo de edição a partir do perfil */
export function profileToClient(p: CustomerProfile): Client {
  return {
    id: p.id,
    company_id: "",
    full_name: p.full_name,
    // Dia do calendário: o diálogo lê só os 10 primeiros caracteres
    birth_date: (p.birth_date ?? "") as unknown as Date,
    cpf: p.cpf,
    rg: p.rg,
    marital_status: p.marital_status,
    gender: (p.gender || Gender.GenderNotSay) as Gender,
    whatsapp: p.whatsapp,
    mobile_phone: p.mobile_phone,
    home_phone: p.home_phone,
    email: p.email,
    address_street: p.address_street,
    address_number: p.address_number,
    address_complement: p.address_complement,
    address_neighborhood: p.address_neighborhood,
    address_city: p.address_city,
    address_state: p.address_state,
    address_zipcode: p.address_zipcode,
    address_country: "Brasil",
    balance_due: p.balance_due,
    created_by: "",
    updated_by: "",
    created_at: new Date(p.created_at),
    updated_at: new Date(p.created_at),
  };
}
