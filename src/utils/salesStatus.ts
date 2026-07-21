import { BadgeVariant } from "../types/badge.type";
import { SaleStatus } from "./statusSales";

export function getSaleStatusLabel(status: SaleStatus | string): string {
  const labels: Record<string, string> = {
    [SaleStatus.Pending]: "Pendente",
    [SaleStatus.Paid]: "Pago",
    [SaleStatus.Overdue]: "Atrasado",
    [SaleStatus.Scheduled]: "Agendado",
    [SaleStatus.Canceled]: "Cancelado",
  };

  return labels[status] || "Desconhecido";
}

export function getSaleStatusVariant(
  status: SaleStatus | string,
): BadgeVariant {
  const variants: Record<string, BadgeVariant> = {
    [SaleStatus.Paid]: "default",
    [SaleStatus.Pending]: "outline",
    [SaleStatus.Canceled]: "destructive",
    [SaleStatus.Overdue]: "destructive",
    [SaleStatus.Scheduled]: "secondary",
  };

  // Se vier um status desconhecido, usamos "outline" como padrão de segurança
  return variants[status] || "outline";
}
