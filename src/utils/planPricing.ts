import { PlansResponse } from "@/interfaces/plans.interface";

type PlanPricing = Pick<PlansResponse, "price_cents" | "original_price_cents">;

// Retorna o preço "de" só quando ele é de fato maior que o preço cobrado.
export function getOriginalPriceCents(plan: PlanPricing): number | null {
  if (!plan.original_price_cents) return null;
  return plan.original_price_cents > plan.price_cents
    ? plan.original_price_cents
    : null;
}

// Percentual de desconto arredondado (ex: 50 para "50% OFF"); null sem desconto.
export function getDiscountPercent(plan: PlanPricing): number | null {
  const original = getOriginalPriceCents(plan);
  if (!original) return null;
  return Math.round((1 - plan.price_cents / original) * 100);
}

// Data da primeira cobrança considerando o teste grátis, no formato dd/mm/aaaa.
export function getFirstChargeDate(trialDays: number, from = new Date()) {
  const date = new Date(from);
  date.setDate(date.getDate() + trialDays);
  return date.toLocaleDateString("pt-BR");
}
