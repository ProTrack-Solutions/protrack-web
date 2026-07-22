"use client";

import {
  ShoppingCart,
  Calculator,
  PackagePlus,
  PackageSearch,
  UserPlus,
  UserSearch,
  Store,
  BarChart3,
  BanknoteArrowUp,
  BanknoteArrowDown,
  TrendingUp,
} from "lucide-react";
import { useSidebar } from "@/context/SidebarContext";
import { Sidebar } from "@/components/Sidebar/Sidebar";
import { SidebarItem } from "@/components/Sidebar/SidebarItem";
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

// Passamos a propriedade children para renderizar as páginas dinamicamente
export function PrivateLayout({ children }: { children: React.ReactNode }) {
  const currentPath = usePathname(); // Corrigido: Já pega o pathname diretamente

  return (
    <div className="flex h-screen">
      <Sidebar>
        <SidebarSectionLabel text="Visão Geral" />
        <SidebarItem
          icon={<Calculator size={20} />}
          text="Dashboard"
          router="/dashboard"
          active={currentPath === "/dashboard"}
          requiredRoles={["ADMIN", "financeiro"]}
        />

        <SidebarSectionLabel text="Gestão" />
        <SidebarItem
          icon={<PackageSearch size={20} />}
          text="Produtos"
          router="/stock"
          active={currentPath === "/stock"}
        />
        <SidebarItem
          icon={<UserSearch size={20} />}
          text="Clientes"
          router="/clients"
          active={currentPath === "/clients"}
        />

        <SidebarSectionLabel text="Vendas" />
        <SidebarItem
          icon={<Store size={20} />}
          text="Nova Venda"
          router="/sale"
          active={currentPath === "/sale"}
          requiredRoles={["ADMIN", "vendedor"]}
        />
        <SidebarItem
          icon={<ShoppingCart size={20} />}
          text="Histórico de Vendas"
          router="/sales-list"
          active={currentPath === "/sales-list"}
          requiredRoles={["ADMIN", "financeiro", "vendedor"]}
        />

        <SidebarSectionLabel text="Financeiro" />
        <SidebarItem
          icon={<BanknoteArrowUp size={20} />}
          text="Contas a Pagar"
          router="/accounts-payable"
          active={currentPath === "/accounts-payable"}
          requiredRoles={["ADMIN", "financeiro"]}
        />
        <SidebarItem
          icon={<BanknoteArrowDown size={20} />}
          text="Contas a Receber"
          router="/accounts-receivable"
          active={currentPath === "/accounts-receivable"}
          requiredRoles={["ADMIN", "financeiro"]}
        />
        <SidebarItem
          icon={<TrendingUp size={20} />}
          text="Fluxo de Caixa"
          router="/cash-flow"
          active={currentPath === "/cash-flow"}
          requiredRoles={["ADMIN", "financeiro"]}
        />
        <SidebarItem
          icon={<BarChart3 size={20} />}
          text="Relatórios"
          router="/relatorio"
          active={currentPath === "/relatorio"}
          requiredRoles={["ADMIN", "financeiro"]}
        />

        <SidebarSectionLabel text="Cadastros" />
        <SidebarItem
          icon={<PackagePlus size={20} />}
          text="Novo Produto"
          router="/product-registration"
          active={currentPath === "/product-registration"}
          requiredRoles={["ADMIN", "operador"]}
        />
        <SidebarItem
          icon={<UserPlus size={20} />}
          text="Novo Cliente"
          router="/client-registration"
          active={currentPath === "/client-registration"}
          requiredRoles={["ADMIN", "operador"]}
        />
      </Sidebar>

      <main className="w-full overflow-auto">
        {children} {/* Corrigido: Substitui o <Outlet /> do antigo Router */}
      </main>
    </div>
  );
}
