import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { AlertTriangle } from "lucide-react";

export interface LimitsData {
  limiteDiario: number;
  limiteSemanal: number;
  limiteMensal: number;
  alertaFluxoCaixa: number;
}

interface LimitsCardProps {
  values: LimitsData;
  onChange: (newValues: LimitsData) => void;
}

export function LimitsCard({ values, onChange }: LimitsCardProps) {
  const handleChange = (field: keyof LimitsData, val: number) => {
    onChange({ ...values, [field]: val });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" /> Limites de Fluxo de Caixa
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Limite Diário (R$)</Label>
            <Input
              type="number"
              value={values.limiteDiario}
              onChange={(e) =>
                handleChange("limiteDiario", Number(e.target.value))
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Limite Semanal (R$)</Label>
            <Input
              type="number"
              value={values.limiteSemanal}
              onChange={(e) =>
                handleChange("limiteSemanal", Number(e.target.value))
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Limite Mensal (R$)</Label>
            <Input
              type="number"
              value={values.limiteMensal}
              onChange={(e) =>
                handleChange("limiteMensal", Number(e.target.value))
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Alerta Fluxo de Caixa (R$)</Label>
            <Input
              type="number"
              value={values.alertaFluxoCaixa}
              onChange={(e) =>
                handleChange("alertaFluxoCaixa", Number(e.target.value))
              }
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
