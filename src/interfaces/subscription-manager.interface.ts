export interface CreatePaymentMethodParams {
  idempotency_key: string;
  set_as_default: boolean;
  stripe_payment_method_id: string;
}

export interface UpdateDefaultPaymentMethodSubiscriptionParams {
  idempotency_key: string;
}

export interface CancelSubiscriptionParams {
  cancel_at_period_end: boolean;
  idempotency_key: string;
  reason: string;
}

export interface SubscriptionDetailsResponse {
  subscription_id: string;
  company_id: string;
  status: string;
  current_period_start: string;
  current_period_end: string;
  canceled_at?: string;
  external_subscription_id: string;
  created_at: string;
  updated_at: string;
  plan: PlanDetailsResponse;
  payment_method: PaymentMethodDetails | null;
  features: PlanFeatureResponse[];
}

export interface PlanDetailsResponse {
  id: string;
  external_id: string;
  external_price_id: string;
  name: string;
  description: string;
  price_cents: number;
  currency: string;
  billing_cycle: string;
  active: boolean;
  highlight: boolean;
  icon: string;
}

export interface PaymentMethodDetails {
  id: string;
  type: string;
  card_brand: string;
  card_last4: string;
  card_exp_month: number;
  card_exp_year: number;
  is_default: boolean;
}

export interface PlanFeatureResponse {
  id: string;
  name: string;
  is_enabled: boolean;
  display_order: number;
  feature_key: string;
  limit_value: number;
}
