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
  useReturnWindowDays,
} from "@/hooks/useCompanySettings";
import { UpsetCompanySettings } from "@/service/company-settings.service";
import { getApiErrorMessage } from "@/utils/apiError";
import { ArrowLeftRight } from "lucide-react";
import { toast } from "sonner";

export const ConfigReturns = () => {
  const { refetch } = useCompanySettings();
  const saved = useReturnWindowDays();
  // Sem edição em andamento, o campo mostra o valor salvo
  const [draft, setDraft] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const value = draft ?? String(saved);

  const days = Number(value);
  const valid = value !== "" && Number.isInteger(days) && days >= 0 && days <= 365;

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await UpsetCompanySettings({
        key: CompanySettings.ReturnWindowDays,
        value: days,
      });
      await refetch();
      setDraft(null);
      toast.success("Prazo de troca atualizado.");
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
            <ArrowLeftRight className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle>Prazo de troca e devolução</CardTitle>
            <CardDescription>
              Quantos dias depois da venda o cliente pode trocar ou devolver.
              Fora do prazo, só um administrador consegue registrar, informando
              o motivo.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={save} className="space-y-3 rounded-lg border p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <div className="space-y-2">
              <Label htmlFor="return-window">Prazo</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="return-window"
                  type="number"
                  min={0}
                  max={365}
                  step={1}
                  value={value}
                  onChange={(e) => setDraft(e.target.value)}
                  className="w-28"
                />
                <span className="text-sm text-muted-foreground">dias</span>
              </div>
            </div>
            <Button type="submit" disabled={!valid || days === saved || saving}>
              {saving ? "Salvando..." : "Salvar"}
            </Button>
          </div>
          {!valid ? (
            <p className="text-sm text-destructive">
              Informe um número inteiro de 0 a 365.
            </p>
          ) : (
            <p className="text-sm text-muted-foreground">
              {days === 0
                ? "Sem prazo: qualquer venda pode ser trocada a qualquer momento."
                : `O cliente tem ${days} ${days === 1 ? "dia" : "dias"} a partir da data da venda.`}
            </p>
          )}
        </form>
      </CardContent>
    </Card>
  );
};
