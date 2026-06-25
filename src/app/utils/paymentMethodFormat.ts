import { PaymentMethod } from "@/enum/methodPayments";

export function getPaymentMethodLabel(method: PaymentMethod | string): string {
  const labels: Record<string, string> = {
    [PaymentMethod.Cash]: "Dinheiro",
    [PaymentMethod.CreditCard]: "Cartão de Crédito",
    [PaymentMethod.DebitCard]: "Cartão de Débito",
    [PaymentMethod.Pix]: "Pix",
    [PaymentMethod.BankTransfer]: "Transferência Bancária",
    [PaymentMethod.Installments]: "Crediário / Parcelado",
    [PaymentMethod.Other]: "Outro",
  };

  // Retorna a tradução correspondente ou "Desconhecido" se não encontrar
  return labels[method] || "Desconhecido";
}
