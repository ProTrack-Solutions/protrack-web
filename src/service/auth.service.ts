import {
  ForgotPasswordParams,
  RegisterParams,
  RegisterResponse,
  ResetPasswordParams,
} from "@/interfaces/auth.interface";
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

export const ForgotPassword = async (
  params: ForgotPasswordParams,
): Promise<void> => {
  await api.post("/auth/forgot-password", params);
};

export const ResetPassword = async (
  params: ResetPasswordParams,
): Promise<void> => {
  await api.post("/auth/reset-password", params);
};
