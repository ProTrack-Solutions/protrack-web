"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  CreditCard,
  Settings,
  User,
  Shield,
  Database,
  Mail,
  Palette,
  Globe,
  Package,
  ArrowLeft,
  Truck,
} from "lucide-react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";

export default function ConfigLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

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
    },
    {
      id: "categorias-produto",
      href: "/config/product-categories",
      titulo: "Categorias de Produto",
      icone: Package,
      descricao: "Cadastro e gestão de categorias",
    },
    {
      id: "fornecedores",
      href: "/config/vendors",
      titulo: "Fornecedores",
      icone: Truck,
      descricao: "Cadastro e gerenciamento de fornecedores",
    },
    {
      id: "sistema",
      href: "/config/system",
      titulo: "Sistema",
      icone: Settings,
      descricao: "Configurações gerais do sistema",
    },
    {
      id: "seguranca",
      href: "/config/security",
      titulo: "Segurança",
      icone: Shield,
      descricao: "Senhas, autenticação e permissões",
    },
    {
      id: "backup",
      href: "/config/backup",
      titulo: "Backup",
      icone: Database,
      descricao: "Backup automático e exportação de dados",
    },
    {
      id: "notificacoes",
      href: "/config/notifications",
      titulo: "Notificações",
      icone: Mail,
      descricao: "E-mail, alertas e comunicações",
    },
    {
      id: "aparencia",
      href: "/config/appearance",
      titulo: "Aparência",
      icone: Palette,
      descricao: "Tema, cores e personalização",
    },
    {
      id: "integracao",
      href: "/config/integrations",
      titulo: "Integrações",
      icone: Globe,
      descricao: "APIs externas e conectores",
    },
  ];

  const queryClient = new QueryClient();

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
        <QueryClientProvider client={queryClient}>
          <Toaster theme="light" richColors closeButton position="top-right" />
          {children}
        </QueryClientProvider>
      </div>
    </div>
  );
}
