import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { BadgeInfo, CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";

import { Gender } from "@/enum/gender.enum";
import { ClienteFormData } from "@/interfaces/client.interface";

interface InformacoesPessoaisProps {
  formData: ClienteFormData;
  date: Date | undefined;
  onChange: (field: keyof ClienteFormData, value: string) => void;
  onDateChange: (date: Date | undefined) => void;
}

export function InformacoesPessoais({
  formData,
  date,
  onChange,
  onDateChange,
}: InformacoesPessoaisProps) {
  return (
    <Card className="border-border/50">
      <CardContent className="p-6 space-y-5">
        <div className="flex items-center gap-3 pb-2 border-b border-border/50">
          <div className="w-10 h-10 rounded-xl bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-sm">
            <BadgeInfo className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              Informações pessoais
            </h2>
            <p className="text-xs text-muted-foreground">
              Dados de identificação do cliente
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2 space-y-2">
            <Label htmlFor="full_name" className="text-sm font-medium">
              Nome completo <span className="text-rose-500">*</span>
            </Label>
            <Input
              id="full_name"
              placeholder="Digite o nome completo"
              value={formData.full_name}
              onChange={(e) => onChange("full_name", e.target.value)}
              className="h-11"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cpf" className="text-sm font-medium">
              CPF <span className="text-rose-500">*</span>
            </Label>
            <Input
              id="cpf"
              placeholder="000.000.000-00"
              value={formData.cpf}
              onChange={(e) => onChange("cpf", e.target.value)}
              className="h-11"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="rg" className="text-sm font-medium">
              RG
            </Label>
            <Input
              id="rg"
              placeholder="00.000.000-0"
              value={formData.rg}
              onChange={(e) => onChange("rg", e.target.value)}
              className="h-11"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Data de nascimento</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full h-11 justify-start text-left font-normal",
                    !date && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? (
                    format(date, "dd/MM/yyyy", { locale: ptBR })
                  ) : (
                    <span>Selecione a data</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  captionLayout="dropdown"
                  selected={date}
                  onSelect={onDateChange}
                  className={cn("p-3 pointer-events-auto")}
                  locale={ptBR}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="gender" className="text-sm font-medium">
              Gênero
            </Label>
            <Select
              value={formData.gender}
              onValueChange={(v) => onChange("gender", v)}
            >
              <SelectTrigger id="gender" className="h-11">
                <SelectValue placeholder="Selecione o gênero" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={Gender.GenderMale}>Masculino</SelectItem>
                <SelectItem value={Gender.GenderFemale}>Feminino</SelectItem>
                <SelectItem value={Gender.GenderOther}>Outro</SelectItem>
                <SelectItem value={Gender.GenderNotSay}>
                  Prefiro não informar
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="marital_status" className="text-sm font-medium">
              Estado civil
            </Label>
            <Select
              value={formData.marital_status}
              onValueChange={(v) => onChange("marital_status", v)}
            >
              <SelectTrigger id="marital_status" className="h-11">
                <SelectValue placeholder="Selecione o estado civil" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="solteiro">Solteiro(a)</SelectItem>
                <SelectItem value="casado">Casado(a)</SelectItem>
                <SelectItem value="divorciado">Divorciado(a)</SelectItem>
                <SelectItem value="viuvo">Viúvo(a)</SelectItem>
                <SelectItem value="uniao_estavel">União Estável</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
