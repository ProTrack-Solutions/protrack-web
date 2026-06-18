import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Boxes, Ruler } from "lucide-react";
import { CardSection } from "./CardSection";
import { ProductFormData } from "@/@types/product-registration.type";

interface FormEstoqueProps {
  formData: ProductFormData;
  onChange: (field: keyof ProductFormData, value: string) => void;
}

export function FormEstoque({ formData, onChange }: FormEstoqueProps) {
  return (
    <CardSection
      icon={Boxes}
      iconGradient="from-indigo-500 to-purple-600"
      title="Estoque e variação"
      subtitle="Quantidade disponível e tamanho"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="quantidade" className="text-sm font-medium">
            Quantidade em estoque
          </Label>
          <Input
            id="quantidade"
            type="number"
            min="0"
            placeholder="0"
            value={formData.quantidade}
            onChange={(e) => onChange("quantidade", e.target.value)}
            className="h-11"
          />
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="tamanho"
            className="text-sm font-medium flex items-center gap-1.5"
          >
            <Ruler className="w-3.5 h-3.5 text-muted-foreground" />
            Tamanho
          </Label>
          <Input
            id="tamanho"
            placeholder="P, M, G, GG, 42, Único..."
            value={formData.tamanho}
            onChange={(e) => onChange("tamanho", e.target.value)}
            className="h-11"
          />
        </div>
      </div>
    </CardSection>
  );
}
