import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MapPin } from "lucide-react";
import { estados } from "@/const/states.const";
import { ClienteFormData } from "@/interfaces/client.interface";

interface EnderecoProps {
  formData: ClienteFormData;
  onChange: (field: keyof ClienteFormData, value: string) => void;
}

export function Endereco({ formData, onChange }: EnderecoProps) {
  return (
    <Card className="border-border/50">
      <CardContent className="p-6 space-y-5">
        <div className="flex items-center gap-3 pb-2 border-b border-border/50">
          <div className="w-10 h-10 rounded-xl bg-linear-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-sm">
            <MapPin className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">Endereço</h2>
            <p className="text-xs text-muted-foreground">
              Localização completa do cliente
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2 space-y-2">
            <Label htmlFor="address_street" className="text-sm font-medium">
              Rua / Avenida
            </Label>
            <Input
              id="address_street"
              placeholder="Digite aqui"
              value={formData.address_street}
              onChange={(e) => onChange("address_street", e.target.value)}
              className="h-11"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address_number" className="text-sm font-medium">
              Número
            </Label>
            <Input
              id="address_number"
              placeholder="Digite aqui"
              value={formData.address_number}
              onChange={(e) => onChange("address_number", e.target.value)}
              className="h-11"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address_complement" className="text-sm font-medium">
              Complemento
            </Label>
            <Input
              id="address_complement"
              placeholder="Digite aqui"
              value={formData.address_complement}
              onChange={(e) => onChange("address_complement", e.target.value)}
              className="h-11"
            />
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="address_neighborhood"
              className="text-sm font-medium"
            >
              Bairro
            </Label>
            <Input
              id="address_neighborhood"
              placeholder="Digite aqui"
              value={formData.address_neighborhood}
              onChange={(e) => onChange("address_neighborhood", e.target.value)}
              className="h-11"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address_city" className="text-sm font-medium">
              Cidade
            </Label>
            <Input
              id="address_city"
              placeholder="Digite aqui"
              value={formData.address_city}
              onChange={(e) => onChange("address_city", e.target.value)}
              className="h-11"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address_state" className="text-sm font-medium">
              Estado
            </Label>
            <Select
              value={formData.address_state}
              onValueChange={(v) => onChange("address_state", v)}
            >
              <SelectTrigger id="address_state" className="h-11">
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                {estados.map((uf) => (
                  <SelectItem key={uf} value={uf}>
                    {uf}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address_zipcode" className="text-sm font-medium">
              CEP
            </Label>
            <Input
              id="address_zipcode"
              placeholder="Digite aqui"
              value={formData.address_zipcode}
              onChange={(e) => onChange("address_zipcode", e.target.value)}
              className="h-11"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address_country" className="text-sm font-medium">
              País
            </Label>
            <Input
              id="address_country"
              placeholder="Digite aqui"
              value={formData.address_country}
              onChange={(e) => onChange("address_country", e.target.value)}
              className="h-11"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
