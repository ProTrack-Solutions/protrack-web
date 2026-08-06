import { GenerateLabelParams } from "@/interfaces/label.interface";
import { api } from "./api";

export const GenerateLabel = async (
  params: GenerateLabelParams[],
): Promise<void> => {
  // ⚠️ Adicione responseType: 'blob' para baixar arquivos binários como PDF
  const response = await api.post("/label/download", params, {
    responseType: "blob",
  });

  // Cria o link temporário no navegador para forçar o download do arquivo PDF
  const blob = new Blob([response.data], { type: "application/pdf" });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", "etiquetas_produtos.pdf");
  document.body.appendChild(link);
  link.click();

  // Limpeza
  link.remove();
  window.URL.revokeObjectURL(url);
};
