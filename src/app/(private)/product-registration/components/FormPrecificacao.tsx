import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DollarSign, Percent, TrendingUp } from "lucide-react";
import { CardSection } from "./CardSection";
import { ProductFormData } from "@/@types/product-registration.type";
import { useMargem } from "@/hooks/useMargem";

interface FormPrecificacaoProps {
  formData: ProductFormData;
  onChange: (field: keyof ProductFormData, value: string) => void;
}

export function FormPrecificacao({
  formData,
  onChange,
}: FormPrecificacaoProps) {
  const { margemValor, margemPercent, margemTone } = useMargem(
    formData.precoCusto,
    formData.precoVenda,
  );

  return (
    <CardSection
      icon={DollarSign}
      iconGradient="from-emerald-500 to-teal-600"
      title="Precificação"
      subtitle="Custo, venda e margem de lucro"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="precoCusto" className="text-sm font-medium">
            Preço de custo
          </Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
              R$
            </span>
            <Input
              id="precoCusto"
              type="number"
              step="0.01"
              min="0"
              placeholder="0,00"
              value={formData.precoCusto}
              onChange={(e) => onChange("precoCusto", e.target.value)}
              className="h-11 pl-10"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="precoVenda" className="text-sm font-medium">
            Preço de venda <span className="text-rose-500">*</span>
          </Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
              R$
            </span>
            <Input
              id="precoVenda"
              type="number"
              step="0.01"
              min="0"
              placeholder="0,00"
              value={formData.precoVenda}
              onChange={(e) => onChange("precoVenda", e.target.value)}
              className="h-11 pl-10"
            />
          </div>
        </div>
      </div>

      <div
        className={`relative overflow-hidden rounded-xl bg-gradient-to-r ${margemTone} p-5 text-white shadow-sm`}
      >
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_right,white,transparent_60%)]" />
        <div className="relative flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-lg bg-white/20 backdrop-blur flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-white/80 font-medium">
                Margem de lucro
              </p>
              <p className="text-2xl font-bold">
                R$ {margemValor.toFixed(2).replace(".", ",")}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur font-semibold">
            <Percent className="w-4 h-4" />
            {margemPercent.toFixed(1)}%
          </div>
        </div>
      </div>
    </CardSection>
  );
}
