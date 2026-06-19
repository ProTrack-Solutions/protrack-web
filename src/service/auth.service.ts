import { LoginParams, LoginResponse } from "@/@types/auth.type";
import { api } from "./api";

export const Login = async (params: LoginParams): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>("/auth/login", params);
  return response.data;
};
