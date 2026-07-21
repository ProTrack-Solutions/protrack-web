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

  return labels[method] || "Desconhecido";
}

export function getPaymentMethodColor(method: PaymentMethod | string): string {
  const colors: Record<string, string> = {
    [PaymentMethod.Cash]: "#10B981",
    [PaymentMethod.CreditCard]: "#2563EB",
    [PaymentMethod.DebitCard]: "#0EA5E9",
    [PaymentMethod.Pix]: "#32BCB4",
    [PaymentMethod.BankTransfer]: "#4F46E5",
    [PaymentMethod.Installments]: "#F59E0B",
    [PaymentMethod.Other]: "#6B7280",
  };

  return colors[method] || "#94A3B8";
}

export function getPaymentMethodHSLColor(
  method: PaymentMethod | string,
): string {
  const colors: Record<string, string> = {
    [PaymentMethod.Cash]: "hsl(var(--primary))", // Cor principal
    [PaymentMethod.CreditCard]: "hsl(var(--secondary))", // Cor secundária
    [PaymentMethod.DebitCard]: "hsl(var(--accent))", // Cor de destaque
    [PaymentMethod.Pix]: "hsl(var(--chart-1, 173 58% 39%))", // Um tom esverdeado/teal do Pix
    [PaymentMethod.BankTransfer]: "hsl(var(--muted-foreground))",
    [PaymentMethod.Installments]: "hsl(var(--warning, 38 92% 50%))",
    [PaymentMethod.Other]: "hsl(var(--muted))",
  };

  return colors[method] || "hsl(var(--border))";
}
