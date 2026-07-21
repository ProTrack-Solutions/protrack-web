"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
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
import { Building2, MapPin, Contact } from "lucide-react";
import { CreateCompanyParams } from "@/interfaces/companies.interface";
import { CreateCompany } from "@/service/companies.service";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const initialData: CreateCompanyParams = {
  address_city: "",
  address_complement: "",
  address_country: "",
  address_neighborhood: "",
  address_number: "",
  address_state: "",
  address_street: "",
  address_zipcode: "",
  document: "",
  document_type: "",
  email: "",
  name: "",
  phone: "",
  status: "",
  timezone: "",
  trade_name: "",
  website: "",
};

interface CompanyRegistrationModalProps {
  open: boolean;
}

export const DialogCompanyRegister = ({
  open,
}: CompanyRegistrationModalProps) => {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<CreateCompanyParams>(initialData);
  const { update: updateHasCompany } = useSession();
  const router = useRouter();

  const update = (field: keyof CreateCompanyParams, value: string) =>
    setData((prev) => ({ ...prev, [field]: value }));

  const steps = [
    { title: "Dados da Empresa", icon: Building2 },
    { title: "Contato", icon: Contact },
    { title: "Endereço", icon: MapPin },
  ];

  const canAdvance = () => {
    if (step === 0)
      return data.name.trim() && data.document.trim() && data.document_type;
    if (step === 1) return data.email.trim() && data.phone.trim();
    if (step === 2)
      return (
        data.address_street.trim() &&
        data.address_city.trim() &&
        data.address_state.trim() &&
        data.address_zipcode.trim()
      );
    return false;
  };

  const handleSubmit = async () => {
    try {
      await CreateCompany(data);
      await updateHasCompany({ hasCompany: true });
      toast.success("Empresa criada com sucesso!");
      router.push("/dashboard");
    } catch (error) {
      console.log(error);
      toast.error("Erro ao criar empresa!");
    } finally {
      setData(initialData);
    }
  };

  return (
    <Dialog open={open}>
      <DialogContent
        className="sm:max-w-140 [&>button]:hidden"
        onPointerDownOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="text-xl">Cadastro da Empresa</DialogTitle>
          <DialogDescription>
            Configure os dados da sua empresa para começar a usar o sistema.
          </DialogDescription>
        </DialogHeader>

        {/* Stepper */}
        <div className="flex items-center gap-2 mb-2">
          {steps.map((s, i) => {
            const Icon = s.icon;
            const isActive = i === step;
            const isDone = i < step;
            return (
              <div key={i} className="flex items-center gap-2 flex-1">
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full shrink-0 transition-colors ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : isDone
                        ? "bg-primary/20 text-primary"
                        : "bg-muted text-muted-foreground"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <span
                  className={`text-xs font-medium hidden sm:block ${isActive ? "text-foreground" : "text-muted-foreground"}`}
                >
                  {s.title}
                </span>
                {i < steps.length - 1 && (
                  <div
                    className={`h-px flex-1 ${isDone ? "bg-primary/40" : "bg-border"}`}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Step 0 - Dados da Empresa */}
        {step === 0 && (
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Razão Social *</Label>
              <Input
                id="name"
                placeholder="Razão social da empresa"
                value={data.name}
                onChange={(e) => update("name", e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="trade_name">Nome Fantasia</Label>
              <Input
                id="trade_name"
                placeholder="Nome fantasia"
                value={data.trade_name}
                onChange={(e) => update("trade_name", e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="document_type">Tipo de Documento *</Label>
                <Select
                  value={data.document_type}
                  onValueChange={(v) => update("document_type", v)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CNPJ">CNPJ</SelectItem>
                    <SelectItem value="CPF">CPF</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="document">Documento *</Label>
                <Input
                  id="document"
                  placeholder={
                    data.document_type === "CNPJ"
                      ? "00.000.000/0000-00"
                      : "000.000.000-00"
                  }
                  value={data.document}
                  onChange={(e) => update("document", e.target.value)}
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 1 - Contato */}
        {step === 1 && (
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">E-mail *</Label>
              <Input
                id="email"
                type="email"
                placeholder="empresa@email.com"
                value={data.email}
                onChange={(e) => update("email", e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone">Telefone *</Label>
              <Input
                id="phone"
                placeholder="(00) 00000-0000"
                value={data.phone}
                onChange={(e) => update("phone", e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                placeholder="https://www.empresa.com.br"
                value={data.website}
                onChange={(e) => update("website", e.target.value)}
              />
            </div>
          </div>
        )}

        {/* Step 2 - Endereço */}
        {step === 2 && (
          <div className="grid gap-4">
            <div className="grid grid-cols-[1fr_100px] gap-4">
              <div className="grid gap-2">
                <Label htmlFor="address_street">Rua *</Label>
                <Input
                  id="address_street"
                  placeholder="Nome da rua"
                  value={data.address_street}
                  onChange={(e) => update("address_street", e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="address_number">Número</Label>
                <Input
                  id="address_number"
                  placeholder="Nº"
                  value={data.address_number}
                  onChange={(e) => update("address_number", e.target.value)}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="address_complement">Complemento</Label>
                <Input
                  id="address_complement"
                  placeholder="Sala, andar..."
                  value={data.address_complement}
                  onChange={(e) => update("address_complement", e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="address_neighborhood">Bairro</Label>
                <Input
                  id="address_neighborhood"
                  placeholder="Bairro"
                  value={data.address_neighborhood}
                  onChange={(e) =>
                    update("address_neighborhood", e.target.value)
                  }
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="address_city">Cidade *</Label>
                <Input
                  id="address_city"
                  placeholder="Cidade"
                  value={data.address_city}
                  onChange={(e) => update("address_city", e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="address_state">Estado *</Label>
                <Input
                  id="address_state"
                  placeholder="UF"
                  value={data.address_state}
                  onChange={(e) => update("address_state", e.target.value)}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="address_zipcode">CEP *</Label>
                <Input
                  id="address_zipcode"
                  placeholder="00000-000"
                  value={data.address_zipcode}
                  onChange={(e) => update("address_zipcode", e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="address_country">País</Label>
                <Input
                  id="address_country"
                  placeholder="País"
                  value={data.address_country}
                  onChange={(e) => update("address_country", e.target.value)}
                />
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between pt-2">
          <Button
            variant="outline"
            onClick={() => setStep((s) => s - 1)}
            disabled={step === 0}
          >
            Voltar
          </Button>
          {step < 2 ? (
            <Button
              onClick={() => setStep((s) => s + 1)}
              disabled={!canAdvance()}
            >
              Próximo
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={!canAdvance()}>
              Cadastrar Empresa
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
