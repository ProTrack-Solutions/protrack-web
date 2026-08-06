"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Truck, Contact, MapPin, FileText, Save, X } from "lucide-react";
import { toast } from "sonner";
import {
  CreateVendorsParams,
  ListVendorsResponse,
} from "@/interfaces/vendors.interface";
import { CreateVendors, UpdateVendor } from "@/service/vendors.service";

const empty: CreateVendorsParams = {
  name: "",
  tax_id: "",
  email: "",
  phone: "",
  address_line_1: "",
  address_line_2: "",
  number: "",
  neighborhood: "",
  city: "",
  state: "",
  postal_code: "",
  country: "",
};

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  fornecedor?: ListVendorsResponse | null;
}

export function DialogNewVendors({ open, onOpenChange, fornecedor }: Props) {
  const [data, setData] = useState<CreateVendorsParams>(() =>
    fornecedor ? { ...empty, ...fornecedor } : empty,
  );
  const isEdit = !!fornecedor?.id;

  const update = <K extends keyof CreateVendorsParams>(
    field: K,
    value: CreateVendorsParams[K],
  ) => setData((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    try {
      e.preventDefault();
      if (!data.name.trim() || !data.tax_id.trim()) {
        toast.error("Preencha razão social e documento.");
        return;
      }
      if (isEdit) {
        await UpdateVendor(fornecedor.id, data);
      } else {
        await CreateVendors(data);
      }

      toast.success(
        isEdit
          ? "Fornecedor atualizado com sucesso!"
          : "Fornecedor cadastrado com sucesso!",
      );
    } catch (error) {
      console.log(error);
      toast.error(
        isEdit ? "Erro ao atualizar fornecedor!" : "Erro ao criar fornecedor!",
      );
    } finally {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="min-w-3xl max-h-[90vh] overflow-y-auto p-0">
        {/* Header gradiente */}
        <div className="bg-linear-to-r from-primary to-primary/80 p-6 rounded-t-lg">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-white/20">
                <Truck className="h-6 w-6 text-white" />
              </div>
              <div>
                <DialogTitle className="text-white text-xl">
                  {isEdit ? "Editar Fornecedor" : "Novo Fornecedor"}
                </DialogTitle>
                <DialogDescription className="text-white/80">
                  {isEdit
                    ? "Atualize as informações do fornecedor."
                    : "Cadastre um novo fornecedor no sistema."}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Dados principais */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <FileText className="h-4 w-4 text-primary" /> Dados principais
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="name">
                  Razão Social <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="name"
                  value={data.name}
                  onChange={(e) => update("name", e.target.value)}
                  placeholder="Digite aqui"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="document">
                  Documento <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="document"
                  value={data.tax_id}
                  onChange={(e) => update("tax_id", e.target.value)}
                  placeholder="Digite aqui"
                  
                    data.tax_id === "CNPJ"
                      ? "00.000.000/0000-00"
                      : "000.000.000-00"
                  }
                  required
                />
              </div>
            </div>
          </section>

          <Separator />

          {/* Contato */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <Contact className="h-4 w-4 text-primary" /> Contato
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  value={data.email}
                  onChange={(e) => update("email", e.target.value)}
                  placeholder="Digite aqui"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Telefone</Label>
                <Input
                  id="phone"
                  value={data.phone}
                  onChange={(e) => update("phone", e.target.value)}
                  placeholder="Digite aqui"
                />
              </div>
            </div>
          </section>

          <Separator />

          {/* Endereço */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <MapPin className="h-4 w-4 text-primary" /> Endereço
            </div>
            <div className="grid gap-4 md:grid-cols-[1fr_120px]">
              <div className="space-y-2">
                <Label htmlFor="address_street">Rua</Label>
                <Input
                  id="address_street"
                  value={data.address_line_1}
                  onChange={(e) => update("address_line_1", e.target.value)}
                  placeholder="Digite aqui"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address_number">Número</Label>
                <Input
                  id="address_number"
                  value={data.number}
                  onChange={(e) => update("number", e.target.value)}
                  placeholder="Digite aqui"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address_number">Pais</Label>
                <Input
                  id="country"
                  value={data.country}
                  onChange={(e) => update("country", e.target.value)}
                  placeholder="Digite aqui"
                />
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="address_complement">Complemento</Label>
                <Input
                  id="address_complement"
                  value={data.address_line_2}
                  onChange={(e) => update("address_line_2", e.target.value)}
                  placeholder="Digite aqui"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address_neighborhood">Bairro</Label>
                <Input
                  id="address_neighborhood"
                  value={data.neighborhood}
                  onChange={(e) => update("neighborhood", e.target.value)}
                  placeholder="Digite aqui"
                />
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="address_city">Cidade</Label>
                <Input
                  id="address_city"
                  value={data.city}
                  onChange={(e) => update("city", e.target.value)}
                  placeholder="Digite aqui"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address_state">UF</Label>
                <Input
                  id="address_state"
                  value={data.state}
                  onChange={(e) => update("state", e.target.value)}
                  placeholder="Selecione"
                  maxLength={2}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address_zipcode">CEP</Label>
                <Input
                  id="address_zipcode"
                  value={data.postal_code}
                  onChange={(e) => update("postal_code", e.target.value)}
                  placeholder="Digite aqui"
                />
              </div>
            </div>
          </section>

          <DialogFooter className="gap-2 bg-transparent">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              <X className="h-4 w-4 mr-2" />
              Cancelar
            </Button>
            <Button type="submit">
              <Save className="h-4 w-4 mr-2" />
              {isEdit ? "Salvar Alterações" : "Cadastrar Fornecedor"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
