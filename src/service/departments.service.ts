import { GetDepartmentsResponse } from "@/interfaces/departments.interface";
import { api } from "./api";

export const GetDepartments = async (): Promise<GetDepartmentsResponse[]> => {
  const response = api.get<GetDepartmentsResponse[]>("/departments/list");
  return (await response).data;
};
