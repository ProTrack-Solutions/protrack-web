import {
  CreateDepartmentsParams,
  GetDepartmentsResponse,
  UpdateDepartmentParams,
  UpdateStatusDepartmentParams,
} from "@/interfaces/departments.interface";
import { api } from "./api";

export const GetDepartments = async (): Promise<GetDepartmentsResponse[]> => {
  const response = api.get<GetDepartmentsResponse[]>("/departments/list");
  return (await response).data;
};

export const CreateDepartments = async (
  params: CreateDepartmentsParams,
): Promise<void> => {
  await api.post("/departments", params);
};

export const UpdateStatusDepartments = async (
  departmentId: string,
  params: UpdateStatusDepartmentParams,
) => {
  await api.put(`/departments/status/${departmentId}`, params);
};

export const UpdateDepartments = async (
  departmentId: string,
  params: UpdateDepartmentParams,
): Promise<void> => {
  await api.put(`/departments/${departmentId}`, params);
};
