import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Bell } from "lucide-react";

export interface AlertsData {
  contasVencidas: boolean;
  estoqueMinimo: boolean;
  fluxoCaixaNegativo: boolean;
  metaVendas: boolean;
  limiteCredito: boolean;
}

interface AlertsCardProps {
  alerts: AlertsData;
  onChange: (newAlerts: AlertsData) => void;
}

export function AlertsCard({ alerts, onChange }: AlertsCardProps) {
  const handleToggle = (field: keyof AlertsData, checked: boolean) => {
    onChange({ ...alerts, [field]: checked });
  };

  const alertItems = [
    {
      id: "contasVencidas",
      label: "Contas Vencidas",
      desc: "Alertar sobre contas em atraso",
    },
    {
      id: "estoqueMinimo",
      label: "Estoque Mínimo",
      desc: "Alertar sobre produtos com estoque baixo",
    },
    {
      id: "fluxoCaixaNegativo",
      label: "Fluxo de Caixa Negativo",
      desc: "Alertar quando saldo ficar negativo",
    },
    {
      id: "metaVendas",
      label: "Meta de Vendas",
      desc: "Alertar sobre metas não atingidas",
    },
    {
      id: "limiteCredito",
      label: "Limite de Crédito",
      desc: "Alertar sobre limites excedidos",
    },
  ] as const;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" /> Configurações de Alertas
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          {alertItems.map((item) => (
            <div key={item.id} className="flex items-center justify-between">
              <div>
                <p className="font-medium">{item.label}</p>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
              <Switch
                checked={alerts[item.id]}
                onCheckedChange={(checked) => handleToggle(item.id, checked)}
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
