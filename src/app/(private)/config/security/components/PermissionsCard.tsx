import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Users } from "lucide-react";
import type { Permissoes } from "./types";

interface PermissionsCardProps {
  permissions: Permissoes;
  onChange: (newPermissions: Permissoes) => void;
}

export function PermissionsCard({
  permissions,
  onChange,
}: PermissionsCardProps) {
  const handleToggle = (field: keyof Permissoes, checked: boolean) => {
    onChange({ ...permissions, [field]: checked });
  };

  const permissionItems = [
    { id: "alterarConfiguracoes", label: "Alterar Configurações" },
    { id: "gerenciarUsuarios", label: "Gerenciar Usuários" },
    { id: "acessoRelatorios", label: "Acesso a Relatórios" },
    { id: "exportarDados", label: "Exportar Dados" },
    { id: "backup", label: "Backup" },
  ] as const;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Permissões de Usuário
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {permissionItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-3 rounded-lg border"
            >
              <div>
                <h4 className="font-medium">{item.label}</h4>
                <p className="text-sm text-muted-foreground">
                  {permissions[item.id]
                    ? "Permissão ativa"
                    : "Permissão inativa"}
                </p>
              </div>
              <Switch
                checked={permissions[item.id]}
                onCheckedChange={(checked) => handleToggle(item.id, checked)}
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
