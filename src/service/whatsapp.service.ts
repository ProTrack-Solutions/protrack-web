import {
  ConnectionsStateResponse,
  CreateInstanceResponse,
} from "@/interfaces/whatsapp.interface";
import { api } from "./api";

export const CreateInstance = async (): Promise<CreateInstanceResponse> => {
  const response = await api.post<CreateInstanceResponse>(
    "/whatsapp/instance/create",
  );
  return response.data;
};

export const ConnectionState = async (): Promise<ConnectionsStateResponse> => {
  const response = await api.get<ConnectionsStateResponse>(
    "/whatsapp/instance/connection-state",
  );
  return response.data;
};

export const DeleteInstance = async (): Promise<void> => {
  await api.delete("/whatsapp/instance/delete");
};

export const ConnectInstance = async (): Promise<CreateInstanceResponse> => {
  const response = await api.get<CreateInstanceResponse>(
    "/whatsapp/instance/connect",
  );
  return response.data;
};
