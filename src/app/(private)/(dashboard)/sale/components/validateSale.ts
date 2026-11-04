import { FieldPath } from "react-hook-form";
import { brl } from "@/components/DashCard";
import { PaymentMethod } from "@/enum/methodPayments";
import { CreateSaleParams } from "@/interfaces/sale.interface";
import { Product } from "@/interfaces/products.interface";

/** Mesmo limite de parcelas da API (domain.MaxInstallments) */
export const MAX_INSTALLMENTS = 24;

export interface SaleFieldError {
  /** Campo que recebe a mensagem; "root" quando o erro é da venda como um todo */
  field: FieldPath<CreateSaleParams> | "root";
  message: string;
}

const round = (value: number) => Math.round(value * 100) / 100;

/**
 * Confere a venda antes de enviar, com as mesmas regras da API
 * (ValidateCreateSaleRequest + checagens do CreateSale). Devolve todos os
 * erros encontrados; lista vazia = pode enviar.
 */
export function validateSale(
  data: CreateSaleParams,
  products: Product[],
): SaleFieldError[] {
  const errors: SaleFieldError[] = [];
  const byId = new Map(products.map((p) => [p.id, p]));
  const method = data.payment_method;
  const isInstallments = method === PaymentMethod.Installments;

  if (!Object.values(PaymentMethod).includes(method)) {
    errors.push({ field: "payment_method", message: "Selecione a forma de pagamento" });
  }

  // Itens
  const items = data.items ?? [];
  if (items.length === 0) {
    errors.push({ field: "root", message: "Adicione pelo menos um produto à venda" });
  }

  const seen = new Set<string>();
  const requested: Record<string, number> = {};
  let subtotal = 0;

  items.forEach((item, i) => {
    if (!item.product_id) {
      errors.push({ field: `items.${i}.product_id`, message: "Selecione o produto" });
      return;
    }
    if (seen.has(item.product_id)) {
      errors.push({
        field: `items.${i}.product_id`,
        message: "Produto repetido; some a quantidade na outra linha",
      });
    }
    seen.add(item.product_id);

    const quantity = Number(item.quantity);
    if (!Number.isInteger(quantity) || quantity < 1) {
      errors.push({ field: `items.${i}.quantity`, message: "Mínimo 1" });
      return;
    }

    requested[item.product_id] = (requested[item.product_id] ?? 0) + quantity;
    const product = byId.get(item.product_id);
    if (product) {
      subtotal += product.sale_price * quantity;
      if (!product.sell_in_bulk && requested[item.product_id] > product.quantity) {
        errors.push({
          field: `items.${i}.quantity`,
          message: `Estoque: ${product.quantity}`,
        });
      }
    }
  });

  if (items.length > 0 && subtotal <= 0 && !errors.some((e) => e.field.startsWith("items"))) {
    errors.push({ field: "root", message: "O valor total dos produtos deve ser maior que zero" });
  }

  // Desconto
  const discount = round(Number(data.discount_amount) || 0);
  if (discount < 0) {
    errors.push({ field: "discount_amount", message: "O desconto não pode ser negativo" });
  } else if (subtotal > 0 && discount > round(subtotal)) {
    errors.push({
      field: "discount_amount",
      message: `O desconto não pode passar de ${brl(subtotal)}`,
    });
  }

  const total = round(subtotal - Math.max(discount, 0));

  // Crediário
  if (isInstallments) {
    if (!data.customer_id) {
      errors.push({ field: "customer_id", message: "Venda no crediário exige um cliente" });
    }
    const count = Number(data.installments_count);
    if (!Number.isInteger(count) || count < 1 || count > MAX_INSTALLMENTS) {
      errors.push({
        field: "installments_count",
        message: `Escolha de 1 a ${MAX_INSTALLMENTS} parcelas`,
      });
    }
    const dueDay = Number(data.due_days);
    if (!Number.isInteger(dueDay) || dueDay < 1 || dueDay > 31) {
      errors.push({ field: "due_days", message: "Selecione o dia de vencimento" });
    }
    const downPayment = Number(data.prohibited) || 0;
    if (downPayment < 0) {
      errors.push({ field: "prohibited", message: "A entrada não pode ser negativa" });
    } else if (total > 0 && downPayment >= total) {
      errors.push({
        field: "prohibited",
        message: `A entrada deve ser menor que o total (${brl(total)})`,
      });
    }
  }

  // Cartão de crédito parcelado
  if (method === PaymentMethod.CreditCard) {
    const count = Number(data.installments_count);
    if (!Number.isInteger(count) || count < 1 || count > MAX_INSTALLMENTS) {
      errors.push({
        field: "installments_count",
        message: `Escolha de 1 a ${MAX_INSTALLMENTS} parcelas`,
      });
    }
  }

  // Vale-troca (no crediário ele é descartado antes do envio)
  const credit = round(Number(data.credit_amount) || 0);
  if (!isInstallments && credit !== 0) {
    if (credit < 0) {
      errors.push({ field: "credit_amount", message: "O vale-troca não pode ser negativo" });
    } else if (!data.customer_id) {
      errors.push({ field: "customer_id", message: "Para usar vale-troca, selecione o cliente" });
    } else if (total > 0 && credit > total) {
      errors.push({
        field: "credit_amount",
        message: `Use no máximo ${brl(total)} do vale-troca`,
      });
    }
  }

  // Valor recebido em dinheiro (total ou entrada)
  const received = Number(data.amount_received) || 0;
  if (received < 0) {
    errors.push({ field: "amount_received", message: "O valor recebido não pode ser negativo" });
  } else if (received > 0) {
    const due = isInstallments
      ? Number(data.prohibited) || 0
      : method === PaymentMethod.Cash
        ? Math.max(total - credit, 0)
        : 0;
    if (due > 0 && round(received) < round(due)) {
      errors.push({
        field: "amount_received",
        message: `O valor recebido é menor que ${brl(due)}`,
      });
    }
  }

  return errors;
}
