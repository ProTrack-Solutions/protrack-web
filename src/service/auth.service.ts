import { RegisterParams, RegisterResponse } from "@/interfaces/auth.interface";
import { api } from "./api";

export const Register = async (
  params: RegisterParams,
): Promise<RegisterResponse> => {
  const { data } = await api.post<RegisterResponse>(
    "/auth/register",
    params,
  );
  return data;
};
