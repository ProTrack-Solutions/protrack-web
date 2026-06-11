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
          icon={<Calculator size={18} />}
          text="Dashboard Financeiro"
          router="/financeiro"
          active={currentPath === "/financeiro" || currentPath === "/"}
          requiredRoles={["admin", "financeiro"]}
        />

        <SidebarSectionLabel text="Gestão" />
        <SidebarItem
          icon={<PackageSearch size={18} />}
          text="Produtos"
          router="/produtos"
          active={currentPath === "/produtos"}
        />
        <SidebarItem
          icon={<UserSearch size={18} />}
          text="Clientes"
          router="/clientes"
          active={currentPath === "/clientes"}
        />

        <SidebarSectionLabel text="Vendas" />
        <SidebarItem
          icon={<Store size={18} />}
          text="Nova Venda"
          router="/venda"
          active={currentPath === "/venda"}
          requiredRoles={["admin", "vendedor"]}
        />
        <SidebarItem
          icon={<ShoppingCart size={18} />}
          text="Histórico de Vendas"
          router="/totalVendas"
          active={currentPath === "/totalVendas"}
          requiredRoles={["admin", "financeiro", "vendedor"]}
        />

        <SidebarSectionLabel text="Financeiro" />
        <SidebarItem
          icon={<BanknoteArrowUp size={18} />}
          text="Contas a Pagar"
          router="/contasPagar"
          active={currentPath === "/contasPagar"}
          requiredRoles={["admin", "financeiro"]}
        />
        <SidebarItem
          icon={<BanknoteArrowDown size={18} />}
          text="Contas a Receber"
          router="/contasReceber"
          active={currentPath === "/contasReceber"}
          requiredRoles={["admin", "financeiro"]}
        />
        <SidebarItem
          icon={<TrendingUp size={18} />}
          text="Fluxo de Caixa"
          router="/flucoCaixa"
          active={currentPath === "/flucoCaixa"}
          requiredRoles={["admin", "financeiro"]}
        />
        <SidebarItem
          icon={<BarChart3 size={18} />}
          text="Relatórios"
          router="/relatorio"
          active={currentPath === "/relatorio"}
          requiredRoles={["admin", "financeiro"]}
        />

        <SidebarSectionLabel text="Cadastros" />
        <SidebarItem
          icon={<PackagePlus size={18} />}
          text="Novo Produto"
          router="/cadastroprodutos"
          active={currentPath === "/cadastroprodutos"}
          requiredRoles={["admin", "operador"]}
        />
        <SidebarItem
          icon={<UserPlus size={18} />}
          text="Novo Cliente"
          router="/cadastrodeclientes"
          active={currentPath === "/cadastrodeclientes"}
          requiredRoles={["admin", "operador"]}
        />
      </Sidebar>

      <main className="flex-1 overflow-auto">
        {children} {/* Corrigido: Substitui o <Outlet /> do antigo Router */}
      </main>
    </div>
  );
}
