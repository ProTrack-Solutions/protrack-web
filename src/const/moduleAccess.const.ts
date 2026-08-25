// Mapeamento de páginas -> módulo de departamento (ou role) necessário para
// acessá-las. Espelha exatamente as mesmas regras aplicadas no backend pelo
// middleware RequireModule (internal/adapters/http/middleware/module.go) e
// pelo RequireRole em cada domínio, para que o front esconda/bloqueie o que o
// usuário de fato não pode chamar na API.
//
// Regras:
// - `module` ausente e `role` ausente => qualquer usuário autenticado acessa.
// - `role` presente => exige exatamente essa role (ex.: "ADMIN"), ignorando módulo.
// - `module` presente => ADMIN sempre passa; demais roles precisam ter o
//   módulo liberado no próprio departamento (ver user.modules em /me).
export interface RouteAccessRule {
  path: string;
  module?: string;
  role?: string;
}

// Páginas do dashboard (grupo (dashboard))
export const DASHBOARD_ROUTE_ACCESS: RouteAccessRule[] = [
  { path: "/dashboard", module: "financial" },
  { path: "/stock", module: "inventory" },
  { path: "/clients", module: "customers" },
  { path: "/sale", module: "sales" },
  { path: "/sales-list", module: "sales" },
  { path: "/accounts-payable", module: "financial" },
  { path: "/accounts-receivable", module: "financial" },
  { path: "/cash-flow", module: "financial" },
  { path: "/relatorio", module: "reports" },
  { path: "/product-registration", module: "inventory" },
  { path: "/client-registration", module: "customers" },
];

// Páginas de configuração (grupo /config)
export const CONFIG_ROUTE_ACCESS: RouteAccessRule[] = [
  { path: "/config/user" }, // perfil próprio, sem módulo
  { path: "/config/financial", module: "financial" },
  { path: "/config/product-categories", module: "inventory" },
  { path: "/config/vendors", module: "inventory" },
  { path: "/config/departments" }, // gestão de departamentos, sem módulo
  { path: "/config/system", role: "ADMIN" }, // hoje só tem config de WhatsApp
  { path: "/config/security" }, // senha/segurança da própria conta, sem módulo
  { path: "/config/signature" }, // assinatura/plano da empresa, sem módulo
  { path: "/config/backup" }, // em desenvolvimento, sem módulo
  { path: "/config/notifications" }, // em desenvolvimento, sem módulo
];

export const ALL_ROUTE_ACCESS: RouteAccessRule[] = [
  ...DASHBOARD_ROUTE_ACCESS,
  ...CONFIG_ROUTE_ACCESS,
];

export function findRouteAccessRule(path: string): RouteAccessRule | undefined {
  return ALL_ROUTE_ACCESS.find((rule) => rule.path === path);
}

// Tela "home" de cada módulo, e a ordem de prioridade usada quando o
// departamento tem mais de um módulo liberado. "whatsapp" não entra aqui
// porque não tem página no dashboard hoje (só configuração, ADMIN-only).
const MODULE_HOME_ROUTE: Record<string, string> = {
  financial: "/dashboard",
  sales: "/sale",
  customers: "/clients",
  inventory: "/stock",
  reports: "/relatorio",
};

const MODULE_PRIORITY: string[] = [
  "financial",
  "sales",
  "customers",
  "inventory",
  "reports",
];

// Página de fallback pra quem loga sem nenhum módulo liberado no
// departamento (ou sem departamento) — sempre acessível a qualquer usuário
// autenticado, evita cair direto numa tela de "acesso negado".
export const DEFAULT_AUTHENTICATED_ROUTE = "/config/user";

// Decide pra onde mandar o usuário logo após o login (ou quando ele cai em
// "/" ou "/login" já autenticado). ADMIN sempre vai pro dashboard geral;
// demais usuários vão pra "home" do primeiro módulo liberado no seu
// departamento, seguindo MODULE_PRIORITY.
export function getInitialRoute(
  user?: { role?: string; modules?: string[] } | null,
): string {
  if (!user) return DEFAULT_AUTHENTICATED_ROUTE;
  if (user.role === "ADMIN") return "/dashboard";

  const modules = user.modules ?? [];
  const firstModule = MODULE_PRIORITY.find((module) =>
    modules.includes(module),
  );

  if (!firstModule) return DEFAULT_AUTHENTICATED_ROUTE;

  return MODULE_HOME_ROUTE[firstModule] ?? DEFAULT_AUTHENTICATED_ROUTE;
}
