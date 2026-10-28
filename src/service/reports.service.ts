import { isAxiosError } from "axios";
import {
  GetReportParams,
  ReportResponse,
} from "@/interfaces/reports.interface";
import { api } from "./api";

export const GetReport = async (
  params: GetReportParams,
): Promise<ReportResponse> => {
  const response = await api.get<ReportResponse>("/reports", {
    params: { ...params, format: "json" },
  });
  return response.data;
};

/** Baixa o relatório pronto em Excel ou PDF, gerado pela API */
export const DownloadReport = async (
  params: GetReportParams,
  format: "xlsx" | "pdf",
): Promise<Blob> => {
  try {
    const response = await api.get("/reports", {
      params: { ...params, format },
      responseType: "blob",
    });
    return response.data;
  } catch (error) {
    // Com responseType: 'blob' o JSON de erro ({ error }) também chega como Blob;
    // converte de volta para o getApiErrorMessage conseguir ler a mensagem
    if (isAxiosError(error) && error.response?.data instanceof Blob) {
      try {
        error.response.data = JSON.parse(await error.response.data.text());
      } catch {
        error.response.data = {};
      }
    }
    throw error;
  }
};
