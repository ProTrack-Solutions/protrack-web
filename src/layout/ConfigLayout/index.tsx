"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  CreditCard,
  Settings,
  User,
  Shield,
  Package,
  ArrowLeft,
  Truck,
  Building2,
  Crown,
  Users,
} from "lucide-react";
import { useModuleAccess } from "@/hooks/useModuleAccess";
import { findRouteAccessRule } from "@/const/moduleAccess.const";
import { AccessDenied } from "@/components/AccessDenied";
import { Loading } from "@/components/Loading";

export default function LayoutConfig({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { loading, canAccess } = useModuleAccess();

  const menuConfiguracoes = [
    {
      id: "usuario",
      href: "/config/user",
      titulo: "Usuário",
      icone: User,
      descricao: "Perfil, preferências e dados pessoais",
    },
    {
      id: "financeiras",
      href: "/config/financial",
      titulo: "Financeiras",
      icone: CreditCard,
      descricao: "Contas, métodos de pagamento e categorias",
      module: "financial",
    },
    {
      id: "categorias-produto",
      href: "/config/product-categories",
      titulo: "Categorias de Produto",
      icone: Package,
      descricao: "Cadastro e gestão de categorias",
      module: "inventory",
    },
    {
      id: "fornecedores",
      href: "/config/vendors",
      titulo: "Fornecedores",
      icone: Truck,
      descricao: "Cadastro e gerenciamento de fornecedores",
      module: "inventory",
    },
    {
      id: "departamentos",
      href: "/config/departments",
      titulo: "Departamentos",
      icone: Building2,
      descricao: "Cadastro e gerenciamento de departamentos",
    },
    {
      id: "sistema",
      href: "/config/system",
      titulo: "Sistema",
      icone: Settings,
      descricao: "Configurações gerais do sistema",
      role: "ADMIN",
    },
    {
      id: "seguranca",
      href: "/config/security",
      titulo: "Segurança",
      icone: Shield,
      descricao: "Senhas, autenticação e permissões",
    },
    {
      id: "usuarios",
      href: "/config/users",
      titulo: "Usuarios",
      icone: Users,
      descricao: "Gerenciar usuarios do sistema e suas permições",
    },
    {
      id: "signature",
      href: "/config/signature",
      titulo: "Assinatura",
      icone: Crown,
      descricao: "Gerencie a sua assinatura e pagamentos",
    },
  ].filter((item) => loading || canAccess(item.module, item.role));

  const rule = findRouteAccessRule(pathname);
  const allowed = !rule || canAccess(rule.module, rule.role);

  return (
    <div className="flex h-screen w-full overflow-hidden">
      {/* Menu lateral de configurações */}
      <div className="w-80 border-r bg-background p-6 overflow-y-auto">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="outline"
            size="icon"
            onClick={() => router.push("/dashboard")}
            className="shrink-0 cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Configurações
            </h1>
            <p className="text-sm text-muted-foreground">
              Gerencie todas as configurações do sistema
            </p>
          </div>
        </div>

        <div className="space-y-2">
          {menuConfiguracoes.map((item) => {
            const IconeComponente = item.icone;
            const isAtivo =
              pathname === item.href ||
              (pathname === "/config" && item.href === "/config/financial");

            return (
              <Link
                href={item.href}
                key={item.id}
                className={`w-full block text-left p-3 rounded-lg transition-colors ${
                  isAtivo
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted text-foreground"
                }`}
              >
                <div className="flex items-center gap-3">
                  <IconeComponente className="h-5 w-5" />
                  <div className="flex-1">
                    <p className="font-medium">{item.titulo}</p>
                    <p
                      className={`text-xs ${
                        isAtivo
                          ? "text-primary-foreground/80"
                          : "text-muted-foreground"
                      }`}
                    >
                      {item.descricao}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Conteúdo principal */}
      <div className="flex-1 p-6 overflow-y-auto">
        {loading ? (
          <Loading />
        ) : allowed ? (
          children
        ) : (
          <AccessDenied message="Seu departamento não tem acesso a esta configuração." />
        )}
      </div>
    </div>
  );
}
