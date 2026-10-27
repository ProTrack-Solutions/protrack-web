import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CompanySettings } from "@/enum/company-settings.enum";
import {
  useCompanySettings,
  useLowStockThreshold,
} from "@/hooks/useCompanySettings";
import { UpsetCompanySettings } from "@/service/company-settings.service";
import { getApiErrorMessage } from "@/utils/apiError";
import { getQuantityStyle, getStockLevels } from "@/utils/productsQuantity";
import { Package } from "lucide-react";
import { toast } from "sonner";

export const ConfigStock = () => {
  const { refetch } = useCompanySettings();
  const saved = useLowStockThreshold();
  // Sem edição em andamento, o campo mostra o valor salvo
  const [draft, setDraft] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const value = draft ?? String(saved);

  const lowStock = Number(value);
  const valid = Number.isInteger(lowStock) && lowStock >= 1;
  const levels = getStockLevels(valid ? lowStock : saved);
  const preview = valid ? lowStock : saved;

  const bands = [
    {
      label: "Baixo",
      range: `0 a ${levels.low - 1}`,
      style: getQuantityStyle(0, preview),
    },
    {
      label: "Médio",
      range: `${levels.low} a ${levels.medium - 1}`,
      style: getQuantityStyle(levels.low, preview),
    },
    {
      label: "Normal",
      range: `${levels.medium} ou mais`,
      style: getQuantityStyle(levels.medium, preview),
    },
  ];

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await UpsetCompanySettings({
        key: CompanySettings.LowStock,
        value: lowStock,
      });
      await refetch();
      setDraft(null);
      toast.success("Limite de estoque baixo atualizado.");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Erro ao salvar configuração"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Package className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle>Níveis de estoque</CardTitle>
            <CardDescription>
              Defina a partir de quando um produto é considerado com estoque
              baixo. O nível médio vai até o dobro desse valor.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={save} className="space-y-4 rounded-lg border p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <div className="space-y-2">
              <Label htmlFor="low-stock">Estoque baixo abaixo de</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="low-stock"
                  type="number"
                  min={1}
                  step={1}
                  value={value}
                  onChange={(e) => setDraft(e.target.value)}
                  className="w-28"
                />
                <span className="text-sm text-muted-foreground">unidades</span>
              </div>
            </div>
            <Button
              type="submit"
              disabled={!valid || lowStock === saved || saving}
            >
              {saving ? "Salvando..." : "Salvar"}
            </Button>
          </div>
          {!valid && (
            <p className="text-sm text-destructive">
              Informe um número inteiro maior que zero.
            </p>
          )}

          <div className="grid gap-2 sm:grid-cols-3">
            {bands.map((band) => (
              <div
                key={band.label}
                className={`rounded-lg border px-3 py-2 ${band.style}`}
              >
                <p className="text-sm font-semibold">{band.label}</p>
                <p className="text-xs tabular-nums">{band.range}</p>
              </div>
            ))}
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
