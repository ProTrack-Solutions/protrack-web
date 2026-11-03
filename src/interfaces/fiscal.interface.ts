// NFC-e: o front só fala com o protrack-api, que fala com a protrack-fiscal-api.

export type FiscalEnvironment = "test" | "live";

/** CRT: 1 Simples Nacional, 2 Simples (excesso de sublimite), 3 Regime Normal, 4 MEI */
export type TaxRegime = "1" | "2" | "3" | "4";

export const TAX_REGIME_LABEL: Record<TaxRegime, string> = {
  "1": "Simples Nacional",
  "2": "Simples Nacional – excesso de sublimite",
  "3": "Regime Normal",
  "4": "MEI",
};

export interface CompanyFiscalData {
  name: string;
  trade_name: string;
  cnpj: string;
  state_registration: string;
  phone: string;
  street: string;
  number: string;
  complement: string;
  district: string;
  city: string;
  state: string;
  zip_code: string;
}

export interface FiscalSettings {
  enabled: boolean;
  environment: FiscalEnvironment;
  tax_regime: TaxRegime | null;
  default_tax_profile_id: string | null;
  issuer_registered: boolean;
  certificate_expires_at: string | null;
  server_configured: boolean;
  products_missing_ncm: number;
  company: CompanyFiscalData;
}

export interface UpdateFiscalSettingsParams {
  enabled: boolean;
  default_tax_profile_id: string | null;
}

export interface CertificateInfo {
  expires_at: string;
  expired: boolean;
  days_to_expire: number;
}

export interface FiscalProfileParams {
  state_registration: string;
  tax_regime: TaxRegime | "";
  street: string;
  number: string;
  complement: string;
  district: string;
  city_code: string;
  city_name: string;
  zip_code: string;
  phone: string;
  /** Em branco mantém o CSC atual */
  csc_id: string;
  csc_secret: string;
}

export interface FiscalProfile extends FiscalProfileParams {
  csc_configured: boolean;
}

export interface SefazStatus {
  online: boolean;
  status_code: string;
  reason: string;
  latency_ms: number;
  checked_at: string;
}

export interface TaxProfileParams {
  name: string;
  icms_csosn: string;
  icms_cst: string;
  icms_rate: number | null;
  icms_base_reduction: number | null;
  icms_fcp_rate: number | null;
  cfop: string;
  benefit_code: string;
  pis_cst: string;
  pis_rate: number | null;
  cofins_cst: string;
  cofins_rate: number | null;
  ibs_cbs_cst: string;
  ibs_cbs_class_code: string;
  ibs_state_rate: number | null;
  ibs_city_rate: number | null;
  cbs_rate: number | null;
}

export interface TaxProfile extends TaxProfileParams {
  id: string;
  products_count: number;
  categories_count: number;
  is_default: boolean;
  updated_at: string;
}

export const emptyTaxProfile: TaxProfileParams = {
  name: "",
  icms_csosn: "",
  icms_cst: "",
  icms_rate: null,
  icms_base_reduction: null,
  icms_fcp_rate: null,
  cfop: "5102",
  benefit_code: "",
  pis_cst: "49",
  pis_rate: null,
  cofins_cst: "49",
  cofins_rate: null,
  ibs_cbs_cst: "000",
  ibs_cbs_class_code: "000001",
  ibs_state_rate: null,
  ibs_city_rate: null,
  cbs_rate: null,
};

export interface CategoryFiscal {
  id: string;
  name: string;
  color: string | null;
  tax_profile_id: string | null;
}

export type UnitOfMeasure = "UN" | "KG" | "G" | "L" | "ML";

export interface ProductFiscalParams {
  ncm: string;
  cest: string;
  unit: UnitOfMeasure | "";
  origin: number;
  /** null: herda da categoria / padrão da empresa */
  tax_profile_id: string | null;
}

export interface ProductFiscal {
  product_id: string;
  name: string;
  model_name: string | null;
  ncm: string | null;
  cest: string | null;
  unit: UnitOfMeasure;
  origin: number;
  tax_profile_id: string | null;
  category_tax_profile_id: string | null;
}

/** Origem da mercadoria (tabela A do CST) */
export const ORIGIN_LABEL: Record<number, string> = {
  0: "0 – Nacional",
  1: "1 – Estrangeira, importação direta",
  2: "2 – Estrangeira, adquirida no mercado interno",
  3: "3 – Nacional, conteúdo de importação acima de 40%",
  4: "4 – Nacional, processos produtivos básicos",
  5: "5 – Nacional, conteúdo de importação até 40%",
  6: "6 – Estrangeira, importação direta sem similar nacional",
  7: "7 – Estrangeira, mercado interno sem similar nacional",
  8: "8 – Nacional, conteúdo de importação acima de 70%",
};

export type FiscalDocumentStatus =
  | "PENDING"
  | "PROCESSING"
  | "AUTHORIZED"
  | "REJECTED"
  | "ERROR"
  | "CANCELLED"
  | "CONTINGENCY"
  | "SUPERSEDED"
  | "FAILED";

export interface FiscalDocument {
  id: string;
  sale_id: string;
  environment: FiscalEnvironment;
  attempt: number;
  status: FiscalDocumentStatus;
  number: number | null;
  access_key: string | null;
  protocol: string | null;
  status_code: string | null;
  reject_reason: string | null;
  error_message: string | null;
  contingency: boolean;
  authorized_at: string | null;
  cancel_reason: string | null;
  cancelled_at: string | null;
  created_at: string;
}

export interface FiscalDocumentListItem extends FiscalDocument {
  sale_total: number;
  sale_at: string;
  customer_name: string | null;
}

export interface FiscalDocumentList {
  documents: FiscalDocumentListItem[];
  total: number;
  page: number;
  per_page: number;
}

/** Autorizada ou em contingência: já vale e pode imprimir */
export const isPrintable = (d?: Pick<FiscalDocument, "status"> | null) =>
  d?.status === "AUTHORIZED" || d?.status === "CONTINGENCY";

/** Sem nota válida: o lojista corrige e emite de novo */
export const needsAttention = (d?: Pick<FiscalDocument, "status"> | null) =>
  d?.status === "REJECTED" || d?.status === "FAILED" || d?.status === "ERROR";
