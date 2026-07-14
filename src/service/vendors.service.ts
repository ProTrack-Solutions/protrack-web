import {
  CreateVendorsParams,
  ListVendorsResponse,
  ToggleVendorParams,
  UpdateVendorParams,
} from "@/interfaces/vendors.interface";
import { api } from "./api";

export const ListVendorsIsActive = async (): Promise<ListVendorsResponse[]> => {
  const response = await api.get<ListVendorsResponse[]>(
    "/vendors/list/is-active",
  );
  return response.data;
};

export const ListVendors = async (): Promise<ListVendorsResponse[]> => {
  const response = await api.get<ListVendorsResponse[]>("/vendors/list");
  return response.data;
};

export const CreateVendors = async (
  params: CreateVendorsParams,
): Promise<void> => {
  await api.post("/vendors", params);
};

export const UpdateVendor = async (
  vendorId: string,
  params: UpdateVendorParams,
): Promise<void> => {
  await api.put(`/vendors/${vendorId}`, params);
};

export const ToggleVendor = async (
  vendorId: string,
  params: ToggleVendorParams,
): Promise<void> => {
  await api.put(`/vendors/toggle/${vendorId}`, params);
};
