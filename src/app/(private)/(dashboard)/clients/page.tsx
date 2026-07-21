"use client";

import { useState } from "react";
import {
  Edit,
  UserX,
  Phone,
  Mail,
  MapPin,
  FileText,
  Calendar,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Header } from "@/components/Header";
import { FilterShearch } from "@/components/FilterShearch";
import { useClients } from "@/hooks/useClients";
import { formatPhoneNational } from "@/utils/phoneFormat";
import { formatDocument } from "@/utils/documentFormat";
import { Loading } from "@/components/Loading";
import { formatDate } from "@/utils/dateFormat";
import { DialogEditClients } from "@/components/DialogAlterClients";
import { Client } from "@/interfaces/client.interface";
import { DeleteClient } from "@/service/clients.service";
import { toast } from "sonner";

export default function Clientes() {
  const [searchTerm, setSearchTerm] = useState("");

  const { clients, loading, refetch } = useClients();

  const [clientsSelected, setClientsSelected] = useState<Client>({} as Client);
  const [openDialog, setOpenDialog] = useState(false);

  const filteredClientes = clients.filter(
    (client) =>
      client.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.cpf.includes(searchTerm) ||
      client.mobile_phone.includes(searchTerm),
  );

  const getStatusBadge = (date?: Date | null) => {
    let status = "Ativo";

    if (date === null) {
      status = "Inativo";
    }

    const variants: Record<string, string> = {
      ativo: "bg-green-100 text-green-800 hover:bg-green-100",
      inativo: "bg-gray-100 text-gray-800 hover:bg-gray-100",
    };

    const isAtivo = status?.toLowerCase() === "ativo";
    const currentStatus = isAtivo ? "ativo" : "inativo";

    return (
      <Badge className={variants[currentStatus]}>
        {isAtivo ? "Ativo" : "Inativo"}
      </Badge>
    );
  };

  const handleDeleteClient = async (clientID: string) => {
    try {
      await DeleteClient(clientID);
      toast.success("Cliente deletado com sucesso");
    } catch (error) {
      console.log(error);
      toast.error("Erro ao deletar cliente");
    } finally {
      refetch();
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center w-full h-full">
        <Loading />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <Header
        title="Bem-vindo à página clientes!"
        text="Aqui você pode visualizar todos os clientes cadastrados no sistema.."
      />
      <FilterShearch searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      {/* Tabela de Clientes */}
      <Card className="pt-0">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50 border-b border-border">
              <TableHead>Nome / Razão Social</TableHead>
              <TableHead>Contato</TableHead>
              <TableHead>Documento</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Cadastro</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredClientes.map((cliente) => (
              <TableRow key={cliente.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="font-medium flex flex-row items-center gap-2">
                        {cliente.full_name}
                        <div className="text-sm text-muted-foreground flex flex-row items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDate(cliente.birth_date)}
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        Rua {cliente.address_street}, {cliente.address_number} -
                        {cliente.address_city}, {cliente.address_state}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="text-sm flex items-center gap-1">
                      <Mail className="h-3 w-3 text-muted-foreground" />
                      {cliente.email}
                    </div>
                    <div className="text-sm flex items-center gap-1">
                      <Phone className="h-3 w-3 text-muted-foreground" />
                      {formatPhoneNational(cliente?.mobile_phone)}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="font-mono text-sm">
                  {formatDocument(cliente.cpf)}
                </TableCell>
                <TableCell>{getStatusBadge(cliente.deleted_at)}</TableCell>
                <TableCell>
                  {new Date(cliente.created_at).toLocaleDateString("pt-BR")}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      className="cursor-pointer"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setOpenDialog(true);
                        setClientsSelected(cliente);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      className="cursor-pointer"
                      onClick={() => {
                        handleDeleteClient(cliente.id);
                      }}
                    >
                      {cliente.deleted_at && (
                        <UserX className="h-4 w-4 text-red-600" />
                      )}
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {filteredClientes.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            Nenhum cliente encontrado
          </div>
        )}
      </Card>

      <DialogEditClients
        key={clientsSelected?.id}
        clients={clientsSelected}
        onOpenChange={setOpenDialog}
        open={openDialog}
      />
    </div>
  );
}
