export interface LoginParams {
  email: string;
  password: string;
}

export interface ForgotPasswordParams {
  email: string;
}

export interface ResetPasswordParams {
  token: string;
  new_password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  hasCompany: boolean;
  ExpiresIn: number;
  TokenType: string;
}

export interface UserData {
  name: string;
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
  document: string;
}

export interface CompanyData {
  name: string;
  trade_name: string;
  document: string;
  email: string;
  phone: string;
  website: string;
  address_street: string;
  address_number: string;
  address_complement: string;
  address_neighborhood: string;
  address_city: string;
  address_state: string;
  address_zipcode: string;
  address_country: string;
  timezone: string;
}

export interface PaymentData {
  card_brand: string;
  card_exp_month: number;
  card_exp_year: number;
  card_last_four: string;
  card_token: string;
  plan_id: string;
  type: string;
  card_holder?: string;
}

export interface RegisterResponse {
  company_id: string;
  // Status da assinatura no Stripe logo após a criação (ex: "incomplete",
  // ou "trialing" quando o plano tem teste grátis).
  subscription_status: string;
  // Segredo para concluir a autenticação do cartão (incluindo 3D Secure) no
  // navegador. O método do Stripe.js depende de client_secret_type:
  //   - "payment_intent": stripe.confirmCardPayment (cobrança imediata)
  //   - "setup_intent": stripe.confirmCardSetup (plano com teste grátis)
  client_secret?: string;
  client_secret_type?: "payment_intent" | "setup_intent";
  requires_action: boolean;
  // Fim do teste grátis (ISO 8601); ausente quando o plano não tem trial.
  trial_end?: string;
}

export interface RegisterParams {
  company: {
    address_city: string;
    address_complement: string;
    address_country: string;
    address_neighborhood: string;
    address_number: string;
    address_state: string;
    address_street: string;
    address_zipcode: string;
    document: string;
    email: string;
    name: string;
    phone: string;
    timezone: string;
    trade_name: string;
    website: string;
  };
  payment: {
    card_brand: string;
    card_exp_month: number;
    card_exp_year: number;
    card_last_four: string;
    card_token: string;
    plan_id: string;
    type: string;
  };
  user: {
    document: string;
    email: string;
    name: string;
    password: string;
    username: string;
  };
  idempotency_key: string;
}
