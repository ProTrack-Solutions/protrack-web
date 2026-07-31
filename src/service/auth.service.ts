import { RegisterParams } from "@/interfaces/auth.interface";
import { api } from "./api";

export const Register = async (params: RegisterParams) => {
  await api.post("/auth/register", params);
};
