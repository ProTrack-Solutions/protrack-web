"use client";

import { useState } from "react";
import { SidebarContext } from "@/context/SidebarContext";
import { ChevronFirst, ChevronLast, MoreVertical } from "lucide-react";
import Image from "next/image"; // Otimização de imagens nativa do Next.js

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"; // shadcn/ui
import { useRouter } from "next/navigation"; // Hook de navegação correto para o Next.js

type SidebarProps = {
  children: React.ReactNode;
};

export function Sidebar({ children }: SidebarProps) {
  const [expanded, setExpanded] = useState(false);
  const router = useRouter(); // Instanciando o roteador do Next.js

  const handleLogout = async () => {
    try {
      router.push("/"); // Exemplo de redirecionamento pós-logout caso seu hook não o faça
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  return (
    <aside className="h-screen sidebar relative z-1 flex flex-col overflow-hidden">
      <nav className="h-full min-h-0 flex flex-col bg-white border-r shadow-sm">
        {/* Header */}
        <div className="p-3 pb-1 flex justify-between items-center">
          <div
            className={`overflow-hidden transition-all duration-300 relative ${
              expanded ? "w-22 h-8" : "w-0"
            }`}
          >
            <Image
              src="/logo.svg"
              alt="Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
          <button
            onClick={() => setExpanded((curr) => !curr)}
            className="p-1 rounded-lg bg-gray-50 hover:bg-gray-100 cursor-pointer"
          >
            {expanded ? <ChevronFirst /> : <ChevronLast />}
          </button>
        </div>

        {/* Items */}
        <SidebarContext.Provider value={{ expanded }}>
          <ul className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden px-2 py-1">
            {children}
          </ul>
        </SidebarContext.Provider>

        {/* Footer */}
        <div className="border-t flex p-2.5 relative">
          <Image
            src={`https://ui-avatars.com/api/?background=c7d2fe&color=3730a3&bold=true&name=${encodeURIComponent(
              "User",
            )}`}
            alt="Avatar"
            width={36} // Largura explícita exigida pelo Next.js (w-9 equivaleria a 36px)
            height={36} // Altura explícita exigida pelo Next.js (h-9 equivaleria a 36px)
            className="rounded-md"
            unoptimized // Mantém as requisições diretas para a API externa de avatares sem cachear no servidor do Next
          />
          <div
            className={`flex justify-between items-center overflow-hidden transition-all duration-300 ${
              expanded ? "w-52 ml-3" : "w-0"
            }`}
          >
            <div className="leading-4">
              <h4 className="font-semibold">{"Usuário"}</h4>
              <span className="text-xs text-gray-600">email@exemplo.com</span>
            </div>

            {/* Dropdown de Configurações */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="ml-2 p-1 rounded hover:bg-gray-100">
                  <MoreVertical size={20} className="cursor-pointer" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {
                  <DropdownMenuItem
                    onClick={() => router.push("/config/user")} // Alterado para o push do Next
                    className="cursor-pointer"
                  >
                    Configurações
                  </DropdownMenuItem>
                }
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-red-600 cursor-pointer"
                >
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </nav>
    </aside>
  );
}
