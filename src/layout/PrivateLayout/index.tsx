"use client";

import { Fragment } from "react";
import {
  ShoppingCart,
  Calculator,
  PackagePlus,
  PackageSearch,
  UserPlus,
  UserSearch,
  Store,
  BanknoteArrowUp,
  BanknoteArrowDown,
  TrendingUp,
} from "lucide-react";
import { useSidebar } from "@/context/SidebarContext";
import { Sidebar } from "@/components/Sidebar/Sidebar";
import { SidebarItem } from "@/components/Sidebar/SidebarItem";
import { AccessDenied } from "@/components/AccessDenied";
import { Loading } from "@/components/Loading";
import { useModuleAccess } from "@/hooks/useModuleAccess";
import { findRouteAccessRule } from "@/const/moduleAccess.const";
import { usePathname } from "next/navigation";

function SidebarSectionLabel({ text }: { text: string }) {
  const { expanded } = useSidebar();

  if (!expanded) {
    return <li className="my-1 border-t border-gray-100" />;
  }

  return (
    <li className="px-3 pt-2 pb-0.5 text-[10px] font-semibold uppercase tracking-wider text-gray-400">
      {text}
    </li>
  );
}

interface SidebarItemConfig {
  icon: React.ReactNode;
  text: string;
  router: string;
  module?: string;
}

interface SidebarSectionConfig {
  label: string;
  items: SidebarItemConfig[];
}

// Passamos a propriedade children para renderizar as páginas dinamicamente
export function PrivateLayout({ children }: { children: React.ReactNode }) {
  const currentPath = usePathname(); // Corrigido: Já pega o pathname diretamente
  const { loading, canAccess } = useModuleAccess();

  const rule = findRouteAccessRule(currentPath);
  const allowed = !rule || canAccess(rule.module, rule.role);

  // Seções do menu, agrupadas pra que o cabeçalho de cada uma só apareça
  // quando sobrar pelo menos um item liberado pelo módulo do departamento.
  const sections: SidebarSectionConfig[] = [
    {
      label: "Visão Geral",
      items: [
        {
          icon: <Calculator size={20} />,
          text: "Dashboard",
          router: "/dashboard",
          module: "financial",
        },
      ],
    },
    {
      label: "Gestão",
      items: [
        {
          icon: <PackageSearch size={20} />,
          text: "Produtos",
          router: "/stock",
          module: "inventory",
        },
        {
          icon: <UserSearch size={20} />,
          text: "Clientes",
          router: "/clients",
          module: "customers",
        },
      ],
    },
    {
      label: "Vendas",
      items: [
        {
          icon: <Store size={20} />,
          text: "Nova Venda",
          router: "/sale",
          module: "sales",
        },
        {
          icon: <ShoppingCart size={20} />,
          text: "Histórico de Vendas",
          router: "/sales-list",
          module: "sales",
        },
      ],
    },
    {
      label: "Financeiro",
      items: [
        {
          icon: <BanknoteArrowUp size={20} />,
          text: "Contas a Pagar",
          router: "/accounts-payable",
          module: "financial",
        },
        {
          icon: <BanknoteArrowDown size={20} />,
          text: "Contas a Receber",
          router: "/accounts-receivable",
          module: "financial",
        },
        {
          icon: <TrendingUp size={20} />,
          text: "Fluxo de Caixa",
          router: "/cash-flow",
          module: "financial",
        },
      ],
    },
    {
      label: "Cadastros",
      items: [
        {
          icon: <PackagePlus size={20} />,
          text: "Novo Produto",
          router: "/product-registration",
          module: "inventory",
        },
        {
          icon: <UserPlus size={20} />,
          text: "Novo Cliente",
          router: "/client-registration",
          module: "customers",
        },
      ],
    },
  ];

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar>
        {!loading &&
          sections.map((section) => {
            const visibleItems = section.items.filter((item) =>
              canAccess(item.module),
            );

            if (visibleItems.length === 0) return null;

            return (
              <Fragment key={section.label}>
                <SidebarSectionLabel text={section.label} />
                {visibleItems.map((item) => (
                  <SidebarItem
                    key={item.router}
                    icon={item.icon}
                    text={item.text}
                    router={item.router}
                    active={currentPath === item.router}
                    requiredModule={item.module}
                  />
                ))}
              </Fragment>
            );
          })}
      </Sidebar>

      <main className="w-full overflow-auto">
        {loading ? (
          <Loading />
        ) : allowed ? (
          children // Corrigido: Substitui o <Outlet /> do antigo Router
        ) : (
          <AccessDenied message="Seu departamento não tem acesso a este módulo." />
        )}
      </main>
    </div>
  );
}
