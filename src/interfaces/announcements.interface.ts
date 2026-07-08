export interface ListAnnouncementsResponse {
  data: AnnouncementsResponse[];
  page: number;
  per_page: number;
  total_rows: number;
  total_pages: number;
}

export interface AnnouncementsResponse {
  content: string;
  expires_at: Date;
  starts_at: Date;
  title: string;
  type: string;
}
