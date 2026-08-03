export interface PlansResponse {
  id: string;
  name: string;
  description: string;
  price_cents: number;
  currency: string;
  billing_cycle: string;
  active: true;
  created_at: Date;
  updated_at: Date;
  external_id: string;
  highlight: boolean;
  icon: string;
  features: PlanFeature[];
}

export interface PlanFeature {
  created_at: string;
  display_order: number;
  id: string;
  is_enabled: boolean;
  name: string;
  plan_id: string;
  updated_at: string;
}
