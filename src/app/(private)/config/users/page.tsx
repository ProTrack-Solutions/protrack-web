"use client";

import { useState } from "react";
import {
  Plus,
  Search,
  Pencil,
  UserX,
  UserCheck,
  Users as UsersIcon,
} from "lucide-react";
import { toast } from "sonner";
import { DialogNewUser } from "@/components/DialogNewUser";
import { HeaderConfig } from "@/components/HeaderConfig";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useUsers } from "@/hooks/useUsers";
import { User } from "@/interfaces/user.interface";
import { UpdateUserStatus } from "@/service/user.service";

const roleLabels: Record<string, string> = {
  ADMIN: "Administrador",
  USER: "Usuário",
};

const statusBadgeClass: Record<string, string> = {
  ativo: "bg-emerald-600 hover:bg-emerald-700",
  inativo: "bg-gray-500 hover:bg-gray-600",
  bloqueado: "bg-red-600 hover:bg-red-700",
};

export default function Users() {
  const { users, refetch } = useUsers();

  const [searchTerm, setSearchTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectUser, setSelectUser] = useState<User | null>(null);

  const filteredUsers = (users ?? []).filter(
    (user) =>
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.username?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleToggleStatus = async (user: User) => {
    const newStatus = user.status === "ativo" ? "inativo" : "ativo";

    try {
      await UpdateUserStatus(user.id, { status: newStatus });
      toast.success(
        newStatus === "ativo"
          ? "Usuário ativado com sucesso!"
          : "Usuário desativado com sucesso!",
      );
    } catch (error) {
      console.log(error);
      toast.error("Erro ao alterar status do usuário!");
    } finally {
      refetch();
    }
  };

  const getStatusBadge = (status: string) => (
    <Badge className={statusBadgeClass[status] ?? statusBadgeClass.inativo}>
      {status}
    </Badge>
  );

  return (
    <div className="space-y-6">
      <HeaderConfig
        title="Usuários"
        description="Gerencie os usuários com acesso ao sistema"
      />
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <UsersIcon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle>Usuários</CardTitle>
                <CardDescription>
                  Cadastre e gerencie os usuários que acessam o sistema.
                </CardDescription>
              </div>
            </div>
            <Button
              className="gap-2 cursor-pointer"
              onClick={() => {
                setSelectUser(null);
                setDialogOpen(true);
              }}
            >
              <Plus className="h-4 w-4" /> Novo Usuário
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Pesquisar por nome, email ou username..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {filteredUsers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-3 border-2 border-dashed rounded-lg">
              <div className="p-4 rounded-full bg-muted">
                <UsersIcon className="h-10 w-10 text-muted-foreground" />
              </div>
              <div className="text-center space-y-1 max-w-sm">
                <p className="font-semibold">Nenhum usuário encontrado</p>
                <p className="text-sm text-muted-foreground">
                  Cadastre usuários para liberar o acesso ao sistema.
                </p>
              </div>
              <Button
                variant="outline"
                className="gap-2"
                onClick={() => {
                  setSelectUser(null);
                  setDialogOpen(true);
                }}
              >
                <Plus className="h-4 w-4" /> Cadastrar Usuário
              </Button>
            </div>
          ) : (
            <div className="rounded-lg border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Usuário</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Perfil</TableHead>
                    <TableHead>Departamento</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Último Login</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>
                              {user.name
                                ?.split(" ")
                                .map((n) => n[0])
                                .join("")
                                .toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{user.name}</div>
                            <div className="text-sm text-muted-foreground">
                              @{user.username}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{roleLabels[user.role] ?? user.role}</TableCell>
                      <TableCell>{user.department_name || "—"}</TableCell>
                      <TableCell>{getStatusBadge(user.status)}</TableCell>
                      <TableCell>
                        {user.last_login_at
                          ? new Date(user.last_login_at).toLocaleDateString(
                              "pt-BR",
                            )
                          : "Nunca"}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="cursor-pointer"
                            onClick={() => {
                              setSelectUser(user);
                              setDialogOpen(true);
                            }}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="cursor-pointer"
                            onClick={() => handleToggleStatus(user)}
                          >
                            {user.status === "ativo" ? (
                              <UserX className="h-4 w-4 text-red-600" />
                            ) : (
                              <UserCheck className="h-4 w-4 text-emerald-600" />
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

      <DialogNewUser
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        user={selectUser}
        setSelectUser={setSelectUser}
        key={selectUser?.id ?? "new-user"}
        refetch={refetch}
      />
    </div>
  );
}
