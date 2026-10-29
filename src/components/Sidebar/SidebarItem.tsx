import Link from "next/link";
import { useSidebar } from "../../context/SidebarContext";
import { useModuleAccess } from "@/hooks/useModuleAccess";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type SidebarItemProps = {
  active?: boolean;
  icon: React.ReactNode;
  text: string;
  alert?: boolean;
  router?: string; // rota para navegação
  requiredModule?: string; // módulo de departamento necessário para exibir o item
  requiredRole?: string; // role exata necessária (ignora módulo), ex.: "ADMIN"
};

export function SidebarItem({
  active = false,
  icon,
  text,
  alert = false,
  router,
  requiredModule,
  requiredRole,
}: SidebarItemProps) {
  const { expanded } = useSidebar();
  const { loading, canAccess } = useModuleAccess();

  if (requiredModule || requiredRole) {
    if (loading) return null;

    if (!canAccess(requiredModule, requiredRole)) {
      return null;
    }
  }

  const content = (
    <>
      {icon}
      <span
        className={`overflow-hidden transition-all ${
          expanded ? "w-52 ml-3" : "w-0"
        }`}
      >
        {text}
      </span>
      {alert && (
        <div
          className={`absolute right-2 w-2 h-auto rounded bg-indigo-400 ${
            expanded ? "" : "top-2"
          }`}
        />
      )}
    </>
  );

  // Recolhida, a sidebar só mostra o ícone: o nome aparece no hover. O balão
  // vai num portal porque a lista tem overflow escondido e cortaria ele.
  const withTooltip = (item: React.ReactElement) =>
    expanded ? (
      item
    ) : (
      <Tooltip>
        <TooltipTrigger asChild>{item}</TooltipTrigger>
        <TooltipContent side="right" sideOffset={8}>
          {text}
        </TooltipContent>
      </Tooltip>
    );

  if (router) {
    return withTooltip(
      <li
        className={`
          relative flex items-center w-auto h-9 py-1.5 px-3 my-0.5
          font-medium rounded-md cursor-pointer
          transition-colors group
          ${
            active
              ? "bg-blue-500/30 from-indigo-200 to-indigo-100 text-indigo-900"
              : "hover:bg-indigo-50 text-gray-600"
          }
        `}
      >
        <Link href={router} className="flex items-center w-full">
          {content}
        </Link>
      </li>,
    );
  }

  return withTooltip(
    <li
      className={`
        relative flex items-center py-1.5 px-3 my-0.5
        font-medium rounded-md cursor-pointer
        transition-colors group
        ${
          active
            ? "bg-gradient-primary from-indigo-200 to-indigo-100 text-indigo-800/30"
            : "hover:bg-indigo-50 text-gray-600"
        }
      `}
    >
      {content}
    </li>,
  );
}
