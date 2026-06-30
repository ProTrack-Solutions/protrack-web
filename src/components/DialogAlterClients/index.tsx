"use clients";

import { useState } from "react";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  User,
  CalendarIcon,
  Phone,
  Mail,
  MapPin,
  BadgeInfo,
  CreditCard,
  Save,
  X,
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Client, UpdatedClient } from "@/interfaces/client.interface";
import { Gender } from "@/enum/gender.enum";
import { estados } from "@/const/states.const";
import { UpdateClient } from "@/service/clients.service";

interface DialogEditClientsProps {
  clients: Client;
  setOpenDialog: (param: boolean) => void;
}

const emptyClients: UpdatedClient = {
  full_name: "",
  birth_date: "",
  cpf: "",
  rg: "",
  marital_status: "",
  gender: Gender.GenderFemale,
  whatsapp: "",
  mobile_phone: "",
  home_phone: "",
  email: "",
  address_street: "",
  address_number: "",
  address_complement: "",
  address_neighborhood: "",
  address_city: "",
  address_state: "",
  address_zipcode: "",
  address_country: "Brasil",
  balance_due: 0,
};

export function DialogEditClients({
  clients,
  setOpenDialog,
}: DialogEditClientsProps) {
  console.log("clients", clients);
  const [formData, setFormData] = useState<UpdatedClient>(() => ({
    ...emptyClients,
    ...clients,
    birth_date: clients?.birth_date
      ? format(new Date(clients.birth_date), "yyyy-MM-dd")
      : "",
  }));

  const [date, setDate] = useState<Date | undefined>(() => {
    if (!clients?.birth_date) return undefined;
    const d = new Date(clients.birth_date + "T00:00:00");
    return isNaN(d.getTime()) ? undefined : d;
  });

  const handleChange = (field: keyof UpdatedClient, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleDateChange = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    setFormData((prev) => ({
      ...prev,
      birth_date: selectedDate ? format(selectedDate, "yyyy-MM-dd") : "",
    }));
  };

  const handleUpdateClient = async () => {
    try {
      console.log("formData", formData);
      await UpdateClient(clients.id, formData);

      toast.success("Cliente atualizado com sucesso");
    } catch (error) {
      console.log(error);
      toast.error("Erro ao atualizar cliente");
    } finally {
      setOpenDialog(false);
    }
  };

  return (
    <DialogContent className="min-w-3xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <User className="h-5 w-5 text-primary" />
          Editar Cliente
        </DialogTitle>
        <DialogDescription>
          Atualize as informações do cliente abaixo.
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-6 py-2">
        {/* Informações Pessoais */}
        <div>
          <h4 className="text-sm font-medium mb-3 flex items-center gap-1.5">
            <BadgeInfo className="h-3.5 w-3.5 text-muted-foreground" />{" "}
            Informações Pessoais
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2 space-y-2">
              <Label>
                Nome completo <span className="text-rose-500">*</span>
              </Label>
              <Input
                value={formData.full_name}
                onChange={(e) => handleChange("full_name", e.target.value)}
                placeholder="Ex: João da Silva"
              />
            </div>

            <div className="space-y-2">
              <Label>
                CPF <span className="text-rose-500">*</span>
              </Label>
              <Input
                value={formData.cpf}
                onChange={(e) => handleChange("cpf", e.target.value)}
                placeholder="000.000.000-00"
              />
            </div>

            <div className="space-y-2">
              <Label>RG</Label>
              <Input
                value={formData.rg}
                onChange={(e) => handleChange("rg", e.target.value)}
                placeholder="00.000.000-0"
              />
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-1.5">
                <CalendarIcon className="h-3.5 w-3.5 text-muted-foreground" />{" "}
                Data de nascimento
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
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
                    selected={date}
                    onSelect={handleDateChange}
                    className={cn("p-3 pointer-events-auto")}
                    locale={ptBR}
                    captionLayout="dropdown"
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>Gênero</Label>
              <Select
                value={formData.gender}
                onValueChange={(v) => handleChange("gender", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="masculino">Masculino</SelectItem>
                  <SelectItem value="feminino">Feminino</SelectItem>
                  <SelectItem value="outro">Outro</SelectItem>
                  <SelectItem value="nao_informar">
                    Prefiro não informar
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Estado civil</Label>
              <Select
                value={formData.marital_status}
                onValueChange={(v) => handleChange("marital_status", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
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
        </div>

        <Separator />

        {/* Contato */}
        <div>
          <h4 className="text-sm font-medium mb-3 flex items-center gap-1.5">
            <Phone className="h-3.5 w-3.5 text-muted-foreground" /> Contato
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-1.5">
                <Phone className="h-3.5 w-3.5 text-muted-foreground" /> WhatsApp
              </Label>
              <Input
                value={formData.whatsapp}
                onChange={(e) => handleChange("whatsapp", e.target.value)}
                placeholder="(00) 00000-0000"
              />
            </div>
            <div className="space-y-2">
              <Label>Celular</Label>
              <Input
                value={formData.mobile_phone}
                onChange={(e) => handleChange("mobile_phone", e.target.value)}
                placeholder="(00) 00000-0000"
              />
            </div>
            <div className="space-y-2">
              <Label>Telefone fixo</Label>
              <Input
                value={formData.home_phone}
                onChange={(e) => handleChange("home_phone", e.target.value)}
                placeholder="(00) 0000-0000"
              />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5 text-muted-foreground" /> Email{" "}
                <span className="text-rose-500">*</span>
              </Label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                placeholder="cliente@email.com"
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Endereço */}
        <div>
          <h4 className="text-sm font-medium mb-3 flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-muted-foreground" /> Endereço
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2 space-y-2">
              <Label>Rua / Avenida</Label>
              <Input
                value={formData.address_street}
                onChange={(e) => handleChange("address_street", e.target.value)}
                placeholder="Ex: Rua das Flores"
              />
            </div>
            <div className="space-y-2">
              <Label>Número</Label>
              <Input
                value={formData.address_number}
                onChange={(e) => handleChange("address_number", e.target.value)}
                placeholder="123"
              />
            </div>
            <div className="space-y-2">
              <Label>Complemento</Label>
              <Input
                value={formData.address_complement}
                onChange={(e) =>
                  handleChange("address_complement", e.target.value)
                }
                placeholder="Apto 45, Bloco B..."
              />
            </div>
            <div className="space-y-2">
              <Label>Bairro</Label>
              <Input
                value={formData.address_neighborhood}
                onChange={(e) =>
                  handleChange("address_neighborhood", e.target.value)
                }
                placeholder="Centro"
              />
            </div>
            <div className="space-y-2">
              <Label>Cidade</Label>
              <Input
                value={formData.address_city}
                onChange={(e) => handleChange("address_city", e.target.value)}
                placeholder="São Paulo"
              />
            </div>
            <div className="space-y-2">
              <Label>Estado</Label>
              <Select
                value={formData.address_state}
                onValueChange={(v) => handleChange("address_state", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="UF" />
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
              <Label>CEP</Label>
              <Input
                value={formData.address_zipcode}
                onChange={(e) =>
                  handleChange("address_zipcode", e.target.value)
                }
                placeholder="00000-000"
              />
            </div>
            <div className="space-y-2">
              <Label>País</Label>
              <Input
                value={formData.address_country}
                onChange={(e) =>
                  handleChange("address_country", e.target.value)
                }
                placeholder="Brasil"
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Financeiro */}
        <div>
          <h4 className="text-sm font-medium mb-3 flex items-center gap-1.5">
            <CreditCard className="h-3.5 w-3.5 text-muted-foreground" />{" "}
            Financeiro
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Saldo devedor</Label>
              <Input
                type="number"
                step="0.01"
                value={formData.balance_due}
                onChange={(e) =>
                  handleChange("balance_due", parseFloat(e.target.value) || 0)
                }
                placeholder="0,00"
              />
            </div>
          </div>
        </div>
      </div>

      <DialogFooter className="gap-2 sm:gap-0">
        <Button
          variant="outline"
          onClick={() => {}}
          className="gap-1 cursor-pointer"
        >
          <X className="h-4 w-4" /> Cancelar
        </Button>
        <Button onClick={handleUpdateClient} className="gap-1 cursor-pointer">
          <Save className="h-4 w-4" /> Salvar Alterações
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}
