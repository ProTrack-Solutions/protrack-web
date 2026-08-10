import {
  UpdatePasswordParams,
  UpdateUserParams,
  User,
} from "@/interfaces/user.interface";
import { api } from "./api";

export const Me = async (): Promise<User> => {
  const response = await api.get<User>("/me");
  return response.data;
};

export const UpdateUser = async (
  userId: string,
  params: UpdateUserParams,
): Promise<void> => {
  await api.put(`/${userId}`, params);
};

export const UpdatePassword = async (
  params: UpdatePasswordParams,
): Promise<void> => {
  await api.put("/user/password", params);
};
