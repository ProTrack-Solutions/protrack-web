import { Status } from "@/enum/status.enum";

export interface ProductCategoriesResponse {
  id: string;
  company_id: string;
  name: string;
  color: string;
  status: Status;
  created_by: string;
  updated_by: string;
  deleted_by: string;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date;
}

export interface CreateProductCategoryParams {
  color: string;
  name: string;
}
