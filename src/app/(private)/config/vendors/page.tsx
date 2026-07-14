"use client";

import { DialogNewVendors } from "@/components/DialogNewVendors";
import { HeaderConfig } from "@/components/HeaderConfig";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Table,
} from "@/components/ui/table";
import { useVendors } from "@/hooks/useVendors";
import { ListVendorsResponse } from "@/interfaces/vendors.interface";
import { ToggleVendor } from "@/service/vendors.service";
import {
  Check,
  Mail,
  MapPinHouse,
  Pencil,
  Phone,
  Plus,
  Search,
  Trash2,
  Truck,
} from "lucide-react";

import { useState } from "react";
import { toast } from "sonner";

export default function Vendors() {
  const { vendors, refetch } = useVendors();

  console.log("vendors", vendors);

  const [dialogOpen, setDialogOpen] = useState(false);

  const [selectVendor, setSelectVendor] = useState<ListVendorsResponse>(
    {} as ListVendorsResponse,
  );

  const handleToggleVendor = async (vendorId: string, isActive: boolean) => {
    try {
      if (isActive) {
        isActive = false;
      } else {
        isActive = true;
      }

      await ToggleVendor(vendorId, { is_active: isActive });
      toast.success("Fornecedor desativado com sucesso!");
    } catch (error) {
      console.log(error);
      toast.error("Erro ao desativar fornecedor!");
    } finally {
      refetch();
    }
  };

  return (
    <div className="space-y-6">
      <HeaderConfig
        title="Fornecedores"
        description="Gerencie os fornecedores cadastrados"
      />
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Truck className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle>Fornecedores</CardTitle>
                <CardDescription>
                  Cadastre e gerencie os fornecedores utilizados no sistema.
                </CardDescription>
              </div>
            </div>
            <Button
              className="gap-2 cursor-pointer"
              onClick={() => {
                setDialogOpen(true);
                setSelectVendor({} as ListVendorsResponse);
              }}
            >
              <Plus className="h-4 w-4" /> Novo Fornecedor
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome, documento ou categoria..."
              className="pl-9"
            />
          </div>

          {vendors?.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-3 border-2 border-dashed rounded-lg">
              <div className="p-4 rounded-full bg-muted">
                <Truck className="h-10 w-10 text-muted-foreground" />
              </div>
              <div className="text-center space-y-1 max-w-sm">
                <p className="font-semibold">Nenhum fornecedor encontrado</p>
                <p className="text-sm text-muted-foreground">
                  Cadastre seu primeiro fornecedor para começar a organizar suas
                  compras.
                </p>
              </div>
              <Button variant="outline" className="gap-2">
                <Plus className="h-4 w-4" /> Cadastrar Fornecedor
              </Button>
            </div>
          ) : (
            <div className="rounded-lg border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Status</TableHead>
                    <TableHead>Fornecedor</TableHead>
                    <TableHead>Documento</TableHead>
                    <TableHead>Contato</TableHead>
                    <TableHead>Endereço</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Array.isArray(vendors) &&
                    vendors.map((f) => (
                      <TableRow key={f.id}>
                        <TableCell className="text-center">
                          <Badge
                            className={`${f.is_active ? "bg-green-500" : "bg-red-500"} border-2 border-gray-500`}
                          />
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{f.name}</div>
                          {f.name && (
                            <div className="text-xs text-muted-foreground">
                              {f.name}
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">{f.tax_id || "—"}</div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-0.5 text-sm">
                            {f.email && (
                              <div className="flex items-center gap-1.5 text-muted-foreground">
                                <Mail className="h-3 w-3" /> {f.email}
                              </div>
                            )}
                            {f.phone && (
                              <div className="flex items-center gap-1.5 text-muted-foreground">
                                <Phone className="h-3 w-3" /> {f.phone}
                              </div>
                            )}
                            {!f.email && !f.phone && (
                              <span className="text-muted-foreground">—</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-0.5 text-sm">
                            <div className="flex items-center gap-1.5 text-muted-foreground">
                              <MapPinHouse className="h-3 w-3" />
                              Rua{f.address_line_1} - {f.number}
                            </div>

                            <div className="flex items-center gap-1.5 text-muted-foreground pl-4">
                              {f.city}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="cursor-pointer"
                              onClick={() => {
                                setDialogOpen(true);
                                setSelectVendor(f);
                              }}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-destructive cursor-pointer hover:text-destructive"
                              onClick={() =>
                                handleToggleVendor(f.id, f.is_active)
                              }
                            >
                              {f.is_active ? (
                                <Trash2 className="h-4 w-4" />
                              ) : (
                                <Check className="h-4 w-4 text-green-600" />
                              )}
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <DialogNewVendors
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        fornecedor={selectVendor}
        key={selectVendor.id ?? "new-vendor"}
      />
    </div>
  );
}
