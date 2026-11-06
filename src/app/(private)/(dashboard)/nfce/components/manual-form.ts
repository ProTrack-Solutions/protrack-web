import {
  FiscalModel,
  IEIndicator,
  ManualDocumentInput,
  ManualTransport,
} from "@/interfaces/fiscal.interface";

export const UFS = [
  "AC", "AL", "AM", "AP", "BA", "CE", "DF", "ES", "GO", "MA", "MG", "MS", "MT", "PA",
  "PB", "PE", "PI", "PR", "RJ", "RN", "RO", "RR", "RS", "SC", "SE", "SP", "TO",
];

/**
 * Naturezas mais usadas. O CFOP é o de dentro do estado: para outro estado o
 * servidor troca o 5 pelo 6. Vazio = CFOP do perfil tributário de cada produto.
 */
export const NATURES: {
  label: string;
  cfop: string;
  /** Sem cobrança: pagamento 90 */
  noPayment?: boolean;
}[] = [
  { label: "Venda de mercadoria", cfop: "" },
  { label: "Remessa em bonificação, doação ou brinde", cfop: "5910", noPayment: true },
  { label: "Remessa de amostra grátis", cfop: "5911", noPayment: true },
  { label: "Remessa para demonstração", cfop: "5912", noPayment: true },
  { label: "Remessa para conserto ou reparo", cfop: "5915", noPayment: true },
  { label: "Remessa em consignação", cfop: "5917", noPayment: true },
  { label: "Outra saída de mercadoria", cfop: "5949" },
];

export const IE_INDICATORS: { value: IEIndicator; label: string }[] = [
  { value: "9", label: "Não contribuinte (pessoa física, sem IE)" },
  { value: "1", label: "Contribuinte do ICMS (com IE)" },
  { value: "2", label: "Contribuinte isento de IE" },
];

export const PRESENCES = [
  { value: "1", label: "Presencial" },
  { value: "2", label: "Internet" },
  { value: "3", label: "Teleatendimento" },
  { value: "4", label: "Entrega em domicílio" },
  { value: "5", label: "Presencial fora do estabelecimento" },
  { value: "9", label: "Outros" },
  { value: "0", label: "Não se aplica" },
];

export const FREIGHT_MODES: { value: ManualTransport["mode"]; label: string }[] = [
  { value: "9", label: "Sem frete" },
  { value: "0", label: "Por conta do emitente (CIF)" },
  { value: "1", label: "Por conta do destinatário (FOB)" },
  { value: "2", label: "Por conta de terceiros" },
  { value: "3", label: "Transporte próprio do emitente" },
  { value: "4", label: "Transporte próprio do destinatário" },
];

/** tPag da SEFAZ. nfe = só na NF-e */
export const PAYMENT_METHODS: { value: string; label: string; nfe?: boolean }[] = [
  { value: "01", label: "Dinheiro" },
  { value: "17", label: "Pix" },
  { value: "03", label: "Cartão de crédito" },
  { value: "04", label: "Cartão de débito" },
  { value: "15", label: "Boleto" },
  { value: "18", label: "Transferência" },
  { value: "16", label: "Depósito bancário" },
  { value: "05", label: "Crédito loja" },
  { value: "02", label: "Cheque" },
  { value: "90", label: "Sem pagamento", nfe: true },
  { value: "99", label: "Outros", nfe: true },
];

export interface ItemRow {
  key: string;
  product_id: string;
  product_name: string;
  unit: string;
  description: string;
  quantity: string;
  unit_price: string;
  discount: string;
  cfop: string;
  /** "" = perfil do produto */
  tax_profile_id: string;
}

export interface PaymentRow {
  key: string;
  method: string;
  amount: string;
  description: string;
}

export interface FormState {
  model: FiscalModel;
  idempotency_key: string;
  nature: string;
  default_cfop: string;
  presence: string;
  /** null = automático (não contribuinte é consumidor final) */
  final_consumer: boolean | null;
  recipient: {
    customer_id: string | null;
    document: string;
    name: string;
    ie_indicator: IEIndicator;
    state_registration: string;
    email: string;
    zip_code: string;
    street: string;
    number: string;
    complement: string;
    district: string;
    city_code: string;
    city_name: string;
    state: string;
    phone: string;
  };
  items: ItemRow[];
  payments: PaymentRow[];
  /** O valor do único pagamento acompanha o total até o usuário mexer */
  payment_auto: boolean;
  difal: {
    enabled: boolean;
    destination_rate: string;
    interstate_rate: "4" | "7" | "12";
    fcp_rate: string;
  };
  transport: {
    mode: ManualTransport["mode"];
    carrier_document: string;
    carrier_name: string;
    carrier_ie: string;
    carrier_address: string;
    carrier_city: string;
    carrier_state: string;
    volumes: string;
    species: string;
    net_weight: string;
    gross_weight: string;
  };
  additional_info: string;
}

export const newKey = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

export const emptyForm = (model: FiscalModel = 55): FormState => ({
  model,
  idempotency_key: newKey(),
  nature: NATURES[0].label,
  default_cfop: "",
  presence: "1",
  final_consumer: null,
  recipient: {
    customer_id: null,
    document: "",
    name: "",
    ie_indicator: "9",
    state_registration: "",
    email: "",
    zip_code: "",
    street: "",
    number: "",
    complement: "",
    district: "",
    city_code: "",
    city_name: "",
    state: "",
    phone: "",
  },
  items: [],
  payments: [{ key: newKey(), method: "17", amount: "", description: "" }],
  payment_auto: true,
  difal: { enabled: false, destination_rate: "", interstate_rate: "12", fcp_rate: "" },
  transport: {
    mode: "9",
    carrier_document: "",
    carrier_name: "",
    carrier_ie: "",
    carrier_address: "",
    carrier_city: "",
    carrier_state: "",
    volumes: "",
    species: "",
    net_weight: "",
    gross_weight: "",
  },
  additional_info: "",
});

/** "1.234,56" ou "1234.56" -> número (vazio/ inválido = 0) */
export const num = (v: string) => {
  const s = v.trim();
  if (!s) return 0;
  const normalized = s.includes(",") ? s.replace(/\./g, "").replace(",", ".") : s;
  const n = Number(normalized);
  return Number.isFinite(n) ? n : 0;
};

const optNum = (v: string) => (v.trim() ? num(v) : undefined);

export const digits = (v: string) => v.replace(/\D/g, "");

export const lineTotal = (it: ItemRow) =>
  Math.max(Math.round(num(it.quantity) * num(it.unit_price) * 100) - Math.round(num(it.discount) * 100), 0) / 100;

export const itemsTotal = (items: ItemRow[]) =>
  items.reduce((sum, it) => sum + Math.round(lineTotal(it) * 100), 0) / 100;

export const isNfe = (f: FormState) => f.model === 55;

/** Monta o pedido da API a partir do formulário */
export function toInput(f: FormState): ManualDocumentInput {
  const nfe = isNfe(f);
  const r = f.recipient;
  const doc = digits(r.document);
  const recipient = nfe
    ? {
        document: doc,
        name: r.name,
        ie_indicator: r.ie_indicator,
        state_registration: r.state_registration,
        email: r.email,
        address: {
          street: r.street,
          number: r.number,
          complement: r.complement,
          district: r.district,
          city_code: digits(r.city_code),
          city_name: r.city_name,
          state: r.state,
          zip_code: digits(r.zip_code),
          phone: digits(r.phone),
        },
      }
    : doc
      ? { document: doc, name: r.name }
      : null;

  const difal =
    nfe && f.difal.enabled && f.difal.destination_rate.trim()
      ? {
          destination_rate: num(f.difal.destination_rate),
          interstate_rate: Number(f.difal.interstate_rate) as 4 | 7 | 12,
          fcp_rate: optNum(f.difal.fcp_rate),
        }
      : undefined;

  const t = f.transport;
  const transport =
    nfe && t.mode !== "9"
      ? {
          mode: t.mode,
          carrier: t.carrier_name.trim()
            ? {
                document: digits(t.carrier_document),
                name: t.carrier_name,
                state_registration: t.carrier_ie,
                address: t.carrier_address,
                city_name: t.carrier_city,
                state: t.carrier_state,
              }
            : undefined,
          volumes:
            num(t.volumes) >= 1
              ? [
                  {
                    quantity: Math.floor(num(t.volumes)),
                    species: t.species || undefined,
                    net_weight: optNum(t.net_weight),
                    gross_weight: optNum(t.gross_weight),
                  },
                ]
              : undefined,
        }
      : nfe
        ? { mode: "9" as const }
        : undefined;

  return {
    model: f.model,
    idempotency_key: f.idempotency_key,
    operation_nature: nfe ? f.nature : undefined,
    default_cfop: digits(f.default_cfop) || undefined,
    final_consumer: nfe && f.final_consumer !== null ? f.final_consumer : undefined,
    presence: nfe ? f.presence : undefined,
    recipient,
    items: f.items.map((it) => ({
      product_id: it.product_id,
      description: it.description.trim() !== it.product_name ? it.description : undefined,
      quantity: num(it.quantity),
      unit_price: num(it.unit_price),
      discount: optNum(it.discount),
      cfop: digits(it.cfop) || undefined,
      tax_profile_id: it.tax_profile_id || undefined,
      difal,
    })),
    payments: f.payments.map((p) => ({
      method: p.method,
      amount: p.method === "90" ? 0 : num(p.amount),
      description: p.method === "99" ? p.description : undefined,
    })),
    transport,
    additional_info: f.additional_info.trim() || undefined,
  };
}

export interface CepResult {
  street: string;
  district: string;
  city_name: string;
  city_code: string;
  state: string;
}

/** Endereço e código IBGE da cidade pelo CEP (ViaCEP) */
export async function lookupCep(cep: string): Promise<CepResult | null> {
  const clean = digits(cep);
  if (clean.length !== 8) return null;
  try {
    const res = await fetch(`https://viacep.com.br/ws/${clean}/json/`);
    if (!res.ok) return null;
    const data = await res.json();
    if (data.erro) return null;
    return {
      street: data.logradouro ?? "",
      district: data.bairro ?? "",
      city_name: data.localidade ?? "",
      city_code: data.ibge ?? "",
      state: data.uf ?? "",
    };
  } catch {
    return null;
  }
}

export const formatDocument = (v: string) => {
  const d = digits(v).slice(0, 14);
  if (d.length <= 11) {
    return d
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  }
  return d
    .replace(/(\d{2})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1/$2")
    .replace(/(\d{4})(\d{1,2})$/, "$1-$2");
};

export const formatCep = (v: string) => digits(v).slice(0, 8).replace(/(\d{5})(\d)/, "$1-$2");
