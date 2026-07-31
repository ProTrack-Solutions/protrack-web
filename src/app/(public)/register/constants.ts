import {
  User,
  Building2,
  CreditCard,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

// Ordem alterada: Empresa (1) -> Usuário (2) -> Plano (3) -> Pagamento (4) -> Pronto (5)
export const steps = [
  { id: 1, label: "Empresa", icon: Building2 },
  { id: 2, label: "Usuário", icon: User },
  { id: 3, label: "Plano", icon: Sparkles },
  { id: 4, label: "Pagamento", icon: CreditCard },
  { id: 5, label: "Pronto", icon: CheckCircle2 },
];

export const stepTitles: Record<number, { title: string; subtitle: string }> = {
  1: {
    title: "Dados da empresa",
    subtitle: "Informe os dados cadastrais e endereço.",
  },
  2: {
    title: "Crie sua conta",
    subtitle: "Agora informe seus dados de acesso.",
  },
  3: {
    title: "Escolha seu plano",
    subtitle: "Selecione o que melhor atende seu negócio.",
  },
  4: {
    title: "Forma de pagamento",
    subtitle: "Informe os dados do cartão de crédito.",
  },
  5: { title: "Tudo pronto!", subtitle: "Sua conta foi criada com sucesso." },
};

export const estados = [
  "AC",
  "AL",
  "AP",
  "AM",
  "BA",
  "CE",
  "DF",
  "ES",
  "GO",
  "MA",
  "MT",
  "MS",
  "MG",
  "PA",
  "PB",
  "PR",
  "PE",
  "PI",
  "RJ",
  "RN",
  "RS",
  "RO",
  "RR",
  "SC",
  "SP",
  "SE",
  "TO",
];

export const onlyDigits = (v: string) => v.replace(/\D/g, "");

export const inputClass = "h-11 bg-muted/50";
export const labelClass = "text-blue-700 font-semibold";
