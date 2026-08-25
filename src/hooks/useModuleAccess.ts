import { useMe } from "@/hooks/useMe";

// Espelha a lógica do middleware RequireModule do backend
// (internal/adapters/http/middleware/module.go): ADMIN sempre passa; demais
// roles só passam se o módulo estiver liberado no próprio departamento.
export function useModuleAccess() {
  const { user, loading } = useMe();

  const canAccess = (module?: string, role?: string): boolean => {
    if (!user) return false;
    if (role) return user.role === role;
    if (!module) return true;
    if (user.role === "ADMIN") return true;
    return (user.modules ?? []).includes(module);
  };

  return { user, loading, canAccess };
}
