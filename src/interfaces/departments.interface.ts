import { ModulesResponse } from "./modules.interface";

export interface GetDepartmentsResponse {
  created_at: Date;
  created_by: string;
  deleted_at: Date;
  deleted_by: string;
  description: string;
  id: string;
  name: string;
  status: string;
  updated_at: Date;
  updated_by: string;
  modules: ModulesResponse[];
}

export interface CreateDepartmentsParams {
  description: string;
  name: string;
  modules: ModulesResponse[];
}

export interface UpdateStatusDepartmentParams {
  Status: string;
}

export interface UpdateDepartmentParams {
  description: string;
  name: string;
  modules: ModulesResponse[];
}
