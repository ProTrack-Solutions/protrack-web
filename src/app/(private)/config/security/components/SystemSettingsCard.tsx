import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Settings } from "lucide-react";
import type { ConfiguracoesSistema } from "./types";

interface SystemSettingsCardProps {
  settings: ConfiguracoesSistema;
  onChange: (newSettings: ConfiguracoesSistema) => void;
}

export function SystemSettingsCard({
  settings,
  onChange,
}: SystemSettingsCardProps) {
  const handleToggle = (
    field: keyof ConfiguracoesSistema,
    checked: boolean,
  ) => {
    onChange({ ...settings, [field]: checked });
  };

  const settingItems = [
    {
      id: "loginAutomatico",
      label: "Login Automático",
      desc: "Permitir login automático neste dispositivo",
    },
    {
      id: "notificacoesSeguranca",
      label: "Notificações de Segurança",
      desc: "Receber alertas sobre atividades suspeitas",
    },
    {
      id: "logAtividades",
      label: "Log de Atividades",
      desc: "Manter registro de todas as atividades",
    },
    {
      id: "bloqueioTentativas",
      label: "Bloqueio de Tentativas",
      desc: "Bloquear após tentativas de login falhadas",
    },
  ] as const;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Configurações de Sistema
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {settingItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-3 rounded-lg border"
            >
              <div>
                <h4 className="font-medium">{item.label}</h4>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
              <Switch
                checked={settings[item.id]}
                onCheckedChange={(checked) => handleToggle(item.id, checked)}
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
