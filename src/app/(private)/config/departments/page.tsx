"use client";

import { DialogConfirm } from "@/components/DialogConfirm";
import { DialogNewDepartments } from "@/components/DialogNewDepartments";
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
import { useDepartments } from "@/hooks/useDepartments";
import { GetDepartmentsResponse } from "@/interfaces/departments.interface";
import {
  DeleteDepartment,
  UpdateStatusDepartments,
} from "@/service/departments.service";
import {
  Building2,
  Plus,
  Search,
  CheckCircle2,
  XCircle,
  Power,
  Pencil,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function Departments() {
  const { departments, refetch } = useDepartments();

  const [openNewDepartments, setOpenNewDepartments] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectDepartment, setSelectDepartment] =
    useState<GetDepartmentsResponse | null>();

  const handleToggleStatus = async (departmentId: string, status: string) => {
    try {
      await UpdateStatusDepartments(departmentId, {
        Status: status,
      });

      toast.success("Status atualizado!");
    } catch (error) {
      console.log(error);
      toast.error("Erro ao alterar status do departamento!");
    } finally {
      refetch();
    }
  };

  const handleDelete = async (departmentId: string) => {
    try {
      DeleteDepartment(departmentId);
      toast.success("Departamento removido com sucesso!");
    } catch (error) {
      console.log(error);
      toast.error("Erro ao remover departamento!");
    } finally {
      refetch();
      setSelectDepartment(null);
    }
  };

  return (
    <div className="space-y-6">
      <HeaderConfig
        description="Gerencie os departamento da empresa"
        title="Departamentos"
      />
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Building2 className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle>Departamentos</CardTitle>
                <CardDescription>
                  Cadastre e gerencie os departamentos da sua empresa.
                </CardDescription>
              </div>
            </div>
            <Button
              className="gap-2 cursor-pointer"
              onClick={() => setOpenNewDepartments(true)}
            >
              <Plus className="h-4 w-4" /> Novo Departamento
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome ou descrição..."
              className="pl-9"
            />
          </div>

          {Array.isArray(departments) && departments?.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-3 border-2 border-dashed rounded-lg">
              <div className="p-4 rounded-full bg-muted">
                <Building2 className="h-10 w-10 text-muted-foreground" />
              </div>
              <div className="text-center space-y-1 max-w-sm">
                <p className="font-semibold">Nenhum departamento cadastrado</p>
                <p className="text-sm text-muted-foreground">
                  Cadastre departamentos para organizar sua equipe.
                </p>
              </div>
              <Button variant="outline" className="gap-2">
                <Plus className="h-4 w-4" /> Cadastrar Departamento
              </Button>
            </div>
          ) : (
            <div className="rounded-lg border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Descrição</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Array.isArray(departments) &&
                    departments?.map((d) => (
                      <TableRow key={d.id}>
                        <TableCell>
                          <div className="font-medium">{d.name}</div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm text-muted-foreground line-clamp-2 max-w-md">
                            {d.description || "—"}
                          </div>
                        </TableCell>
                        <TableCell>
                          {d.status === "ACTIVE" ? (
                            <Badge className="gap-1 bg-emerald-600 hover:bg-emerald-700">
                              <CheckCircle2 className="h-3 w-3" /> Ativo
                            </Badge>
                          ) : (
                            <Badge variant="secondary" className="gap-1">
                              <XCircle className="h-3 w-3" /> Inativo
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button
                              className="cursor-pointer"
                              variant="ghost"
                              size="icon"
                              title={d.status ? "ACTIVE" : "INACTIVE"}
                              onClick={() => {
                                const novoStatus =
                                  d.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
                                handleToggleStatus(d.id, novoStatus);
                              }}
                            >
                              <Power
                                className={`h-4 w-4 ${
                                  d.status === "ACTIVE"
                                    ? "text-red-500"
                                    : "text-emerald-500"
                                }`}
                              />
                            </Button>
                            <Button
                              className="cursor-pointer"
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                setSelectDepartment(d);
                                setOpenNewDepartments(true);
                              }}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-destructive hover:text-destructive cursor-pointer"
                              onClick={() => {
                                setSelectDepartment(d);
                                setConfirmOpen(true);
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
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

        <DialogNewDepartments
          onOpenChange={setOpenNewDepartments}
          setSelectDepartment={setSelectDepartment}
          open={openNewDepartments}
          departamento={selectDepartment}
          key={selectDepartment?.id}
          refetch={refetch}
        />

        <DialogConfirm
          description="Esta ação não pode ser desfeita. O método não estará mais disponível para novas vendas."
          title="Remover método de pagamento?"
          onDelete={handleDelete}
          open={confirmOpen}
          onOpenChange={setConfirmOpen}
          id={selectDepartment?.id ?? ""}
        />
      </Card>
    </div>
  );
}
