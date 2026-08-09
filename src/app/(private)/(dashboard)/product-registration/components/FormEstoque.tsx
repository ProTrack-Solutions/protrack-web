import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Boxes, Ruler, RulerDimensionLine } from "lucide-react";
import { CardSection } from "./CardSection";
import { CreateProductParams } from "@/interfaces/products.interface";
import { Field, FieldGroup } from "@/components/ui/field";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";

interface FormEstoqueProps {
  formData: CreateProductParams;
  onChange: (field: keyof CreateProductParams, value: string | boolean) => void;
}

export function FormEstoque({ formData, onChange }: FormEstoqueProps) {
  const [sellInBulk, setSellInBulk] = useState(false);

  return (
    <CardSection
      icon={Boxes}
      iconGradient="from-indigo-500 to-purple-600"
      title="Estoque e variação"
      subtitle="Quantidade disponível e tamanho"
    >
      <FieldGroup className="max-w-sm">
        <Field orientation="horizontal">
          <Checkbox
            id="sell_in_bulk"
            name="sell_in_bulk"
            className="size-4"
            onClick={() => setSellInBulk((prev) => !prev)}
            checked={formData.sell_in_bulk}
            onCheckedChange={(checked) => onChange("sell_in_bulk", !!checked)}
          />
          <Label
            htmlFor="sell_in_bulk"
            className="text-muted-foreground text-[12px] font-medium "
          >
            Venda a granel
          </Label>
        </Field>
      </FieldGroup>

      {!sellInBulk ? (
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
              value={formData.quantity}
              onChange={(e) => onChange("quantity", e.target.value)}
              className="h-11"
            />
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="tamanho"
              className="text-sm font-medium flex items-center gap-1.5"
            >
              <RulerDimensionLine className="w-3.5 h-3.5 text-muted-foreground" />
              Tamanho
            </Label>
            <Input
              id="tamanho"
              placeholder="Ex: P, M, G, 42"
              value={formData.size}
              onChange={(e) => onChange("size", e.target.value)}
              className="h-11"
            />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label
              htmlFor="unit"
              className="text-sm font-medium flex items-center gap-1.5"
            >
              <Ruler className="w-3.5 h-3.5 text-muted-foreground" />
              Unidade
            </Label>
            <Input
              id="unit"
              placeholder="Ex: kg, L, un"
              value={formData.unit}
              onChange={(e) => onChange("unit", e.target.value)}
              className="h-11"
            />
          </div>
        </div>
      )}
    </CardSection>
  );
}
