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
import { ProductFormData } from "@/@types/product-registration.type";

interface FormInfoBasicaProps {
  formData: ProductFormData;
  onChange: (field: keyof ProductFormData, value: string) => void;
}

export function FormInfoBasica({ formData, onChange }: FormInfoBasicaProps) {
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
            value={formData.nome}
            onChange={(e) => onChange("nome", e.target.value)}
            className="h-11"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="categoria" className="text-sm font-medium">
            Categoria <span className="text-rose-500">*</span>
          </Label>
          <Select
            value={formData.categoria}
            onValueChange={(v) => onChange("categoria", v)}
          >
            <SelectTrigger id="categoria" className="h-11">
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Vestimenta">Vestimenta</SelectItem>
              <SelectItem value="Calçados">Calçados</SelectItem>
              <SelectItem value="Acessórios">Acessórios</SelectItem>
              <SelectItem value="Outros">Outros</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="codigoBarras"
            className="text-sm font-medium flex items-center gap-1.5"
          >
            <Barcode className="w-3.5 h-3.5 text-muted-foreground" />
            Código de barras
          </Label>
          <Input
            id="codigoBarras"
            placeholder="0000000000000"
            value={formData.codigoBarras}
            onChange={(e) => onChange("codigoBarras", e.target.value)}
            className="h-11 font-mono"
          />
        </div>

        <div className="md:col-span-2 space-y-2">
          <Label htmlFor="descricao" className="text-sm font-medium">
            Descrição
          </Label>
          <Textarea
            id="descricao"
            placeholder="Detalhes do produto, características, material..."
            value={formData.descricao}
            onChange={(e) => onChange("descricao", e.target.value)}
            className="min-h-[100px] resize-none"
          />
        </div>
      </div>
    </CardSection>
  );
}
