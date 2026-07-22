import { User } from "@/interfaces/user.interface";
import { api } from "./api";

export const Me = async (): Promise<User> => {
  const response = await api.get<User>("/me");
  return response.data;
};
