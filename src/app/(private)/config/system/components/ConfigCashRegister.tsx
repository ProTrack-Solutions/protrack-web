import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { CompanySettings } from "@/enum/company-settings.enum";
import { useCompanySettings } from "@/hooks/useCompanySettings";
import { useRequireOpenCashRegister } from "@/hooks/useCashRegister";
import { UpsetCompanySettings } from "@/service/company-settings.service";
import { getApiErrorMessage } from "@/utils/apiError";
import { Vault } from "lucide-react";
import { toast } from "sonner";

export const ConfigCashRegister = () => {
  const { refetch } = useCompanySettings();
  const required = useRequireOpenCashRegister();

  const handleChange = async (value: boolean) => {
    try {
      await UpsetCompanySettings({
        key: CompanySettings.RequireOpenCashRegister,
        value,
      });
      await refetch();
      toast.success(
        value
          ? "Vendas e recebimentos agora exigem caixa aberto."
          : "Vendas liberadas sem caixa aberto.",
      );
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Erro ao salvar configuração"));
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Vault className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle>Controle de caixa</CardTitle>
            <CardDescription>
              Defina se os operadores precisam abrir o caixa antes de vender.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-start justify-between gap-4 rounded-lg border p-4">
          <div className="space-y-1">
            <Label htmlFor="require-cash" className="text-sm font-medium">
              Exigir caixa aberto
            </Label>
            <p className="text-sm text-muted-foreground">
              Vendas e recebimentos de parcelas só podem ser registrados com o
              caixa do operador aberto. Assim todo dinheiro que entra cai em
              algum fechamento.
            </p>
          </div>
          <Switch
            className="cursor-pointer"
            id="require-cash"
            checked={required}
            onCheckedChange={handleChange}
          />
        </div>
      </CardContent>
    </Card>
  );
};
