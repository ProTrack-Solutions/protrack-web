import {
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

export const ListAnnouncements = async (
  pagination: Pagination,
): Promise<ListAnnouncementsResponse> => {
  const response = await api.get<ListAnnouncementsResponse>("/announcements", {
    params: {
      page: pagination.Page,
      perPage: pagination.PerPage,
    },
  });
  return response.data;
};
