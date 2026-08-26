import {
  CreateUserParams,
  UpdatePasswordParams,
  UpdateUserParams,
  UpdateUserStatusParams,
  User,
} from "@/interfaces/user.interface";
import { api } from "./api";

export const Me = async (): Promise<User> => {
  const response = await api.get<User>("/me");
  return response.data;
};

export const ListUsers = async (): Promise<User[]> => {
  const response = await api.get<User[]>("/user/list-company");
  return response.data;
};

export const CreateUser = async (params: CreateUserParams): Promise<void> => {
  await api.post("/user", params);
};

export const UpdateUser = async (
  userId: string,
  params: UpdateUserParams,
): Promise<void> => {
  await api.put(`/users/${userId}`, params);
};

export const UpdateUserStatus = async (
  userId: string,
  params: UpdateUserStatusParams,
): Promise<void> => {
  await api.put(`/users/status/${userId}`, params);
};

export const UpdatePassword = async (
  params: UpdatePasswordParams,
): Promise<void> => {
  await api.put("/user/password", params);
};
