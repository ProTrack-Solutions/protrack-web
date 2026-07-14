export interface ListVendorsResponse {
  address_line_1: string;
  address_line_2: string;
  city: string;
  company_id: string;
  country: string;
  created_at: string;
  email: string;
  id: string;
  is_active: boolean;
  name: string;
  neighborhood: string;
  number: string;
  phone: string;
  postal_code: string;
  state: string;
  tax_id: string;
  updated_at: string;
}

export interface CreateVendorsParams {
  address_line_1: string;
  address_line_2: string;
  city: string;
  country: string;
  email: string;
  name: string;
  neighborhood: string;
  number: string;
  phone: string;
  postal_code: string;
  state: string;
  tax_id: string;
}

export interface UpdateVendorParams {
  address_line_1: string;
  address_line_2: string;
  city: string;
  country: string;
  email: string;
  name: string;
  neighborhood: string;
  number: string;
  phone: string;
  postal_code: string;
  state: string;
  tax_id: string;
}

export interface ToggleVendorParams {
  is_active: boolean;
}
