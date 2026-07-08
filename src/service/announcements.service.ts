import { ListAnnouncementsResponse } from "@/interfaces/announcements.interface";
import { api } from "./api";

export const ListAnnouncements = async (): Promise<
  ListAnnouncementsResponse[]
> => {
  const response = await api.get<ListAnnouncementsResponse[]>(
    "/announcements",
    {
      headers: {
        Page: 1,
        PerPage: 20,
      },
    },
  );
  return response.data;
};
