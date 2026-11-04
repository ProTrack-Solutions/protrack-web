import { isAxiosError } from "axios";
import { FieldPath } from "react-hook-form";
import { CreateSaleParams } from "@/interfaces/sale.interface";

export interface SaleApiError {
  title: string;
  description: string;
  /** Campo do formulário a destacar, quando a mensagem da API aponta um */
  field?: FieldPath<CreateSaleParams>;
  /** O erro indica que caixa, estoque ou cliente na tela estão desatualizados */
  refresh?: "cash-register" | "products" | "clients";
}

/** Mensagem da API → campo do formulário */
const FIELD_HINTS: { match: RegExp; field: FieldPath<CreateSaleParams> }[] = [
  { match: /exige um cliente|informe o cliente|cliente não encontrado/i, field: "customer_id" },
  { match: /parcelas/i, field: "installments_count" },
  { match: /vencimento/i, field: "due_days" },
  { match: /entrada/i, field: "prohibited" },
  { match: /desconto/i, field: "discount_amount" },
  { match: /vale-troca/i, field: "credit_amount" },
  { match: /valor recebido/i, field: "amount_received" },
  { match: /forma de pagamento/i, field: "payment_method" },
];

/**
 * Traduz o erro do POST /sales numa mensagem para o vendedor. A API responde
 * { error } com 400 (dados inválidos), 404 (cliente/produto), 409 (estoque,
 * caixa, vale-troca) e 500 (falha interna, sem detalhes).
 */
export function parseSaleApiError(error: unknown): SaleApiError {
  if (!isAxiosError<{ error?: string }>(error)) {
    return {
      title: "Erro ao cadastrar venda",
      description: "Ocorreu um erro inesperado. Tente novamente.",
    };
  }

  if (!error.response) {
    return {
      title: "Sem conexão com o servidor",
      description:
        "A venda não foi enviada. Verifique sua conexão e tente novamente.",
    };
  }

  const { status, data } = error.response;
  // "dados inválidos para a venda: venda a prazo exige um cliente" → "Venda a prazo exige um cliente"
  const raw = (data?.error ?? "")
    .trim()
    .replace(/^dados inválidos para (a venda|atualizar a venda):\s*/i, "");
  const message = raw.charAt(0).toUpperCase() + raw.slice(1);

  if (status === 401 || status === 403) {
    return {
      title: "Sem permissão",
      description:
        message || "Você não tem acesso para registrar vendas. Faça login novamente.",
    };
  }

  if (status >= 500) {
    return {
      title: "Erro no servidor",
      description:
        "A venda não foi registrada. Tente novamente em instantes; se continuar, avise o suporte.",
    };
  }

  // "(item 2)" na mensagem aponta a linha do produto
  const itemMatch = message.match(/\(item (\d+)\)/i);
  const itemField = itemMatch
    ? (`items.${Number(itemMatch[1]) - 1}.product_id` as FieldPath<CreateSaleParams>)
    : undefined;
  const field = itemField ?? FIELD_HINTS.find((h) => h.match.test(message))?.field;

  if (status === 404) {
    return {
      title: "Cadastro não encontrado",
      description: message || "Cliente ou produto não encontrado.",
      field,
      refresh: /cliente/i.test(message) ? "clients" : "products",
    };
  }

  if (status === 409) {
    if (/caixa/i.test(message)) {
      return {
        title: "Caixa indisponível",
        description: message,
        refresh: "cash-register",
      };
    }
    if (/estoque/i.test(message)) {
      return {
        title: "Estoque insuficiente",
        description: message,
        refresh: "products",
      };
    }
    return { title: "Não foi possível registrar a venda", description: message, field };
  }

  return {
    title: "Confira os dados da venda",
    description: message || "Algum dado da venda está inválido.",
    field,
  };
}
