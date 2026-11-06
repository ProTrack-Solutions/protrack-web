import { isAxiosError } from "axios";
import {
  CategoryFiscal,
  CertificateInfo,
  FiscalDocument,
  FiscalDocumentList,
  FiscalProfile,
  FiscalModel,
  FiscalProfileParams,
  FiscalSettings,
  ManualDocumentInput,
  ManualPreview,
  ProductFiscal,
  ProductFiscalParams,
  SefazStatus,
  TaxProfile,
  TaxProfileParams,
  UpdateFiscalSettingsParams,
} from "@/interfaces/fiscal.interface";
import { api } from "./api";

// ---------- Configuração ----------

export const GetFiscalSettings = async (): Promise<FiscalSettings> =>
  (await api.get("/fiscal/settings")).data;

export const UpdateFiscalSettings = async (
  params: UpdateFiscalSettingsParams,
): Promise<FiscalSettings> => (await api.put("/fiscal/settings", params)).data;

export const RegisterFiscalIssuer = async (): Promise<FiscalSettings> =>
  (await api.post("/fiscal/issuer")).data;

export const UploadFiscalCertificate = async (
  file: File,
  password: string,
): Promise<CertificateInfo> => {
  const form = new FormData();
  form.append("file", file);
  form.append("password", password);
  const { data } = await api.post("/fiscal/certificate", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

export const GetFiscalProfile = async (): Promise<FiscalProfile | null> =>
  (await api.get("/fiscal/profile")).data;

export const SaveFiscalProfile = async (
  params: FiscalProfileParams,
): Promise<FiscalProfile> => (await api.put("/fiscal/profile", params)).data;

export const CheckSefazStatus = async (): Promise<SefazStatus> =>
  (await api.get("/fiscal/sefaz-status", { timeout: 60000 })).data;

export const GoLiveFiscal = async (
  csc_id: string,
  csc_secret: string,
): Promise<FiscalSettings> =>
  (await api.post("/fiscal/go-live", { csc_id, csc_secret })).data;

// ---------- Perfis tributários ----------

export const GetTaxProfiles = async (): Promise<TaxProfile[]> =>
  (await api.get("/fiscal/tax-profiles")).data.tax_profiles;

export const CreateTaxProfile = async (
  params: TaxProfileParams,
): Promise<TaxProfile> => (await api.post("/fiscal/tax-profiles", params)).data;

export const UpdateTaxProfile = async (
  id: string,
  params: TaxProfileParams,
): Promise<TaxProfile> =>
  (await api.put(`/fiscal/tax-profiles/${id}`, params)).data;

export const DeleteTaxProfile = async (id: string): Promise<void> => {
  await api.delete(`/fiscal/tax-profiles/${id}`);
};

export const GetFiscalCategories = async (): Promise<CategoryFiscal[]> =>
  (await api.get("/fiscal/categories")).data.categories;

export const SetCategoryTaxProfile = async (
  categoryId: string,
  taxProfileId: string | null,
): Promise<void> => {
  await api.put(`/fiscal/categories/${categoryId}/tax-profile`, {
    tax_profile_id: taxProfileId,
  });
};

// ---------- Produtos ----------

export const GetProductFiscal = async (id: string): Promise<ProductFiscal> =>
  (await api.get(`/fiscal/products/${id}`)).data;

export const UpdateProductFiscal = async (
  id: string,
  params: ProductFiscalParams,
): Promise<number> =>
  (await api.put(`/fiscal/products/${id}`, cleanFiscal(params))).data.updated;

/** Grava em todas as variações do modelo de grade */
export const UpdateModelFiscal = async (
  modelName: string,
  params: ProductFiscalParams,
): Promise<number> =>
  (
    await api.put("/fiscal/models", cleanFiscal(params), {
      params: { name: modelName },
    })
  ).data.updated;

const cleanFiscal = (p: ProductFiscalParams) => ({
  ...p,
  ncm: p.ncm.replace(/\D/g, ""),
  cest: p.cest.replace(/\D/g, ""),
});

// ---------- Notas ----------

export const GetFiscalDocuments = async (params: {
  status?: string;
  model?: FiscalModel;
  source?: "sale" | "manual";
  problems?: boolean;
  page?: number;
  per_page?: number;
}): Promise<FiscalDocumentList> =>
  (await api.get("/fiscal/documents", { params })).data;

/** Última nota de cada venda (só as que têm nota) */
export const GetSalesFiscalDocuments = async (
  saleIds: string[],
): Promise<Record<string, FiscalDocument>> =>
  saleIds.length === 0
    ? {}
    : (await api.get("/fiscal/sales", { params: { ids: saleIds.join(",") } }))
        .data.documents;

export const GetSaleFiscalDocument = async (
  saleId: string,
): Promise<FiscalDocument | null> =>
  (await api.get(`/fiscal/sales/${saleId}`)).data.document;

/** Emite ou reemite (rejeitada/com falha). A SEFAZ pode demorar: timeout maior. */
export const EmitSaleFiscalDocument = async (
  saleId: string,
): Promise<FiscalDocument> =>
  (await api.post(`/fiscal/sales/${saleId}/nfce`, null, { timeout: 60000 }))
    .data.document;

export const CancelFiscalDocument = async (
  id: string,
  reason: string,
): Promise<FiscalDocument> =>
  (
    await api.post(
      `/fiscal/documents/${id}/cancel`,
      { reason },
      { timeout: 60000 },
    )
  ).data;

/** Erro de download em blob: o corpo é JSON dentro do Blob */
const blobError = async (error: unknown): Promise<never> => {
  if (isAxiosError(error) && error.response?.data instanceof Blob) {
    try {
      const parsed = JSON.parse(await error.response.data.text());
      error.response.data = parsed;
    } catch {
      // mantém o erro original
    }
  }
  throw error;
};

const fetchFile = async (path: string): Promise<Blob> => {
  try {
    const { data } = await api.get(path, { responseType: "blob" });
    return data;
  } catch (error) {
    return blobError(error);
  }
};

/** Confere a nota manual sem emitir: problemas, CFOPs e totais */
export const PreviewManualDocument = async (
  input: ManualDocumentInput,
): Promise<ManualPreview> =>
  (
    await api.post("/fiscal/documents/manual/preview", input, {
      timeout: 30000,
    })
  ).data;

/** Emite a NF-e/NFC-e manual. A SEFAZ pode demorar: timeout maior. */
export const EmitManualDocument = async (
  input: ManualDocumentInput,
): Promise<FiscalDocument> =>
  (await api.post("/fiscal/documents/manual", input, { timeout: 60000 })).data
    .document;

/** Abre o PDF da nota (DANFC-e 80 mm ou DANFE A4) em outra aba para imprimir */
export const PrintDanfce = async (documentId: string): Promise<void> => {
  // Abre a aba antes do await: depois dele o navegador bloqueia como pop-up
  const tab = window.open("", "_blank");
  try {
    const blob = await fetchFile(`/fiscal/documents/${documentId}/danfce`);
    const url = URL.createObjectURL(
      new Blob([blob], { type: "application/pdf" }),
    );
    if (tab) {
      tab.location.href = url;
    } else {
      window.open(url, "_blank");
    }
    setTimeout(() => URL.revokeObjectURL(url), 60_000);
  } catch (error) {
    tab?.close();
    throw error;
  }
};

export const DownloadFiscalXml = async (
  documentId: string,
  accessKey: string | null,
  model: FiscalModel = 65,
): Promise<void> => {
  const blob = await fetchFile(`/fiscal/documents/${documentId}/xml`);
  const url = URL.createObjectURL(
    new Blob([blob], { type: "application/xml" }),
  );
  const link = document.createElement("a");
  link.href = url;
  link.download = `${model === 55 ? "nfe" : "nfce"}-${accessKey ?? documentId}.xml`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
};
