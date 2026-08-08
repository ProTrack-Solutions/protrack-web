export interface CreateCompanyParams {
  address_city: string;
  address_complement: string;
  address_country: string;
  address_neighborhood: string;
  address_number: string;
  address_state: string;
  address_street: string;
  address_zipcode: string;
  document: string;
  document_type: string;
  email: string;
  name: string;
  phone: string;
  status: string;
  timezone: string;
  trade_name: string;
  website: string;
}

export interface CompanyResponse {
  address_city: string;
  address_complement: string;
  address_country: string;
  address_neighborhood: string;
  address_number: string;
  address_state: string;
  address_street: string;
  address_zipcode: string;
  created_at: string;
  created_by: string;
  deleted_at: string;
  deleted_by: string;
  document: string;
  document_type: string;
  email: string;
  id: string;
  name: string;
  phone: string;
  status: string;
  trade_name: string;
  updated_at: string;
  updated_by: string;
  website: string;
}
