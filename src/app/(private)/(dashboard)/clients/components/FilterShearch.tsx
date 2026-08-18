"use client";
import { Search } from "lucide-react";
import { Card } from "../../../../../components/ui/card";
import { Input } from "../../../../../components/ui/input";
import { Button } from "../../../../../components/ui/button";
import { useState } from "react";
import FilterPopOver, {
  FiltrosReceber,
} from "../../../../../components/FilterPopOver";
import {
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  Select,
} from "@/components/ui/select";

const types: { value: string; label: string; hint: string }[] = [
  {
    value: "criacao",
    label: "Data de criação",
    hint: "Quando o cliente foi criado",
  },
];

interface Props {
  searchText: string;
  onSearchTextChange: (value: string) => void;
  onSearchChange: (value: string) => void;
  onApplyFilter: (filtros: FiltrosReceber) => void;
  filter: FiltrosReceber;
  statusFilter: "active" | "inactive" | "all";
  setStatusFilter: (params: "active" | "inactive" | "all") => void;
}

export const FilterShearch = ({
  searchText,
  onSearchTextChange,
  onSearchChange,
  filter,
  onApplyFilter,
  setStatusFilter,
  statusFilter,
}: Props) => {
  const [filterOpen, setFilterOpen] = useState(false);

  const handleInputChange = (value: string) => {
    onSearchTextChange(value);

    // Quando o campo é totalmente apagado, volta para a consulta sem filtro
    if (value.trim() === "") {
      onSearchChange("");
    }
  };

  return (
    <Card className="p-4">
      <div className="flex gap-4">
        <Button
          className="gap-2 cursor-pointer"
          onClick={() => onSearchChange(searchText)}
        >
          <Search className="h-4 w-4" />
          Buscar
        </Button>
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Pesquisar por nome, CPF ou email..."
            value={searchText}
            onChange={(e) => handleInputChange(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-45">
            <SelectValue placeholder="Selecione o status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="active">Ativos</SelectItem>
            <SelectItem value="inactive">Inativos</SelectItem>
          </SelectContent>
        </Select>
        <FilterPopOver
          open={filterOpen}
          onOpenChange={setFilterOpen}
          value={filter}
          onApply={onApplyFilter}
          types={types}
        />
      </div>
    </Card>
  );
};
