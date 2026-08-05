import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Barcode, Info } from "lucide-react";
import { CardSection } from "./CardSection";
import { useProductsCategories } from "@/hooks/useProductsCategories";
import { CreateProductParams } from "@/interfaces/products.interface";
import { Field, FieldGroup } from "@/components/ui/field";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";

interface FormInfoBasicaProps {
  formData: CreateProductParams;
  onChange: (field: keyof CreateProductParams, value: string | boolean) => void;
}

export function FormInfoBasica({ formData, onChange }: FormInfoBasicaProps) {
  const { productsCategories } = useProductsCategories();

  const [isBarCode, setIsBarCode] = useState(false);

  return (
    <CardSection
      icon={Info}
      iconGradient="from-blue-500 to-indigo-600"
      title="Informações básicas"
      subtitle="Dados gerais de identificação"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2 space-y-2">
          <Label htmlFor="nome" className="text-sm font-medium">
            Nome do produto <span className="text-rose-500">*</span>
          </Label>
          <Input
            id="nome"
            placeholder="Ex: Camiseta Premium Algodão"
            value={formData.name}
            onChange={(e) => onChange("name", e.target.value)}
            className="h-11"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="categoria" className="text-sm font-medium">
            Categoria <span className="text-rose-500">*</span>
          </Label>

          <Select
            value={formData.category_id}
            onValueChange={(v) => onChange("category_id", v)}
          >
            <SelectTrigger id="categoria" className="h-11">
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              {Array.isArray(productsCategories) &&
                productsCategories.map((category) => (
                  <SelectItem
                    key={category.id || category.name}
                    value={category.id}
                  >
                    {category.name}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="codigoBarras"
            className="text-sm font-medium flex-col items-start gap-1.5"
          >
            <div className="flex items-center gap-1.5 ">
              <Barcode className="w-3.5 h-3.5 text-muted-foreground" />
              Código de barras
            </div>
            <FieldGroup className="max-w-sm">
              <Field orientation="horizontal">
                <Checkbox
                  id="not_barcode"
                  name="not_barcode"
                  className="size-4"
                  onClick={() => setIsBarCode((prev) => !prev)}
                  checked={formData.not_barcode}
                  onCheckedChange={(checked) =>
                    onChange("not_barcode", !!checked)
                  }
                />
                <Label
                  htmlFor="not_barcode"
                  className="text-muted-foreground text-[12px] font-medium "
                >
                  Producto sem código de barras
                </Label>
              </Field>
            </FieldGroup>
          </Label>
          <Input
            id="codigoBarras"
            placeholder="0000000000000"
            value={formData.barcode}
            onChange={(e) => onChange("barcode", e.target.value)}
            className="h-11 font-mono"
            disabled={isBarCode}
          />
        </div>

        <div className="md:col-span-2 space-y-2">
          <Label htmlFor="descricao" className="text-sm font-medium">
            Descrição
          </Label>
          <Textarea
            id="descricao"
            placeholder="Detalhes do produto, características, material..."
            value={formData.description}
            onChange={(e) => onChange("description", e.target.value)}
            className="min-h-25 resize-none"
          />
        </div>
      </div>
    </CardSection>
  );
}
