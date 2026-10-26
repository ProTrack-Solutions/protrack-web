import {
  CreateAnnouncementParams,
  ListAnnouncementsResponse,
  ListTopAnnouncementsOfDayResponse,
} from "@/interfaces/announcements.interface";
import { Pagination } from "@/interfaces/pagination.interface";
import { api } from "./api";

export const ListTopAnnouncementsOfDay = async (): Promise<
  ListTopAnnouncementsOfDayResponse[]
> => {
  const response = await api.get<ListTopAnnouncementsOfDayResponse[]>(
    "/announcements/today",
  );
  return response.data;
};

// /announcements faz o bind da paginação via HEADER (Page, Perpage), não via
// query string — mesmo caso do /invoice-history/company.
export const ListAnnouncements = async (
  pagination: Pagination,
): Promise<ListAnnouncementsResponse> => {
  const response = await api.get<ListAnnouncementsResponse>("/announcements", {
    headers: {
      Page: pagination.Page,
      PerPage: pagination.PerPage,
    },
  });
  return response.data;
};

export const CreateAnnouncement = async (
  params: CreateAnnouncementParams,
): Promise<void> => {
  await api.post("/announcements", params);
};

export const DeleteAnnouncement = async (id: string): Promise<void> => {
  await api.delete(`/announcements/${id}`);
};
