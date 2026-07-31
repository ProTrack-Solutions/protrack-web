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
  features: string[];
}
