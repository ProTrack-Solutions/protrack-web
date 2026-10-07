import { ListTopAnnouncementsOfDayResponse } from "@/interfaces/announcements.interface";
import { api } from "./api";

export const ListTopAnnouncementsOfDay = async (): Promise<
  ListTopAnnouncementsOfDayResponse[]
> => {
  const response = await api.get<ListTopAnnouncementsOfDayResponse[]>(
    "/announcements/today",
  );
  return response.data;
};
