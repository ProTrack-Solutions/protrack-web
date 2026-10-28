import {
  BrowseCustomersParams,
  BrowseCustomersResponse,
  CustomerOverview,
  CustomerProfile,
} from "@/interfaces/customer-profile.interface";
import { api } from "./api";

export const GetCustomerOverview = async (): Promise<CustomerOverview> => {
  const response = await api.get<CustomerOverview>("/customers/overview");
  return response.data;
};

export const BrowseCustomers = async (
  params: BrowseCustomersParams,
): Promise<BrowseCustomersResponse> => {
  const response = await api.get<BrowseCustomersResponse>("/customers/browse", {
    params,
  });
  return response.data;
};

export const GetCustomerProfile = async (id: string): Promise<CustomerProfile> => {
  const response = await api.get<CustomerProfile>(`/customers/${id}/profile`);
  return response.data;
};

export const SetCustomerActive = async (
  id: string,
  active: boolean,
): Promise<CustomerProfile> => {
  const response = await api.post<CustomerProfile>(
    `/customers/${id}/${active ? "reactivate" : "deactivate"}`,
  );
  return response.data;
};
