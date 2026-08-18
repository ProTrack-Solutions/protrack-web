import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";
import FilterPopOver, { FiltrosReceber } from "@/components/FilterPopOver";

const types: { value: string; label: string; hint: string }[] = [
  {
    value: "vencimento",
    label: "Data de vencimento",
    hint: "Quando a conta vence",
  },
  {
    value: "agendamento",
    label: "Data de agendamento",
    hint: "Quando o pagamento foi agendado",
  },
  {
    value: "pagamento",
    label: "Data de pagamento",
    hint: "Quando a conta foi paga",
  },
  {
    value: "criacao",
    label: "Data de criação",
    hint: "Quando a conta foi lançada",
  },
];

interface ContasPagarFiltrosPesquisaProps {
  searchText: string;
  onSearchTextChange: (value: string) => void;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  categoriaFilter: string;
  onCategoriaFilterChange: (value: string) => void;
  categorias: string[];
  filter: FiltrosReceber;
  onApplyFilter: (filtros: FiltrosReceber) => void;
}

export function ContasPagarFiltrosPesquisa({
  searchText,
  onSearchTextChange,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  categoriaFilter,
  onCategoriaFilterChange,
  categorias,
  filter,
  onApplyFilter,
}: ContasPagarFiltrosPesquisaProps) {
  const [filterOpen, setFilterOpen] = useState(false);

  const handleInputChange = (value: string) => {
    onSearchTextChange(value);

    // Quando o campo é totalmente apagado, volta para a consulta sem filtro
    if (value.trim() === "") {
      onSearchChange("");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Filtros e Pesquisa</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-4">
          <Button
            className="gap-2 cursor-pointer"
            onClick={() => onSearchChange(searchText)}
          >
            <Search className="h-4 w-4" />
            Buscar
          </Button>
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Pesquisar por fornecedor ou descrição..."
                value={searchText}
                onChange={(e) => handleInputChange(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
          <Select value={statusFilter} onValueChange={onStatusFilterChange}>
            <SelectTrigger className="w-45">
              <SelectValue placeholder="Selecione o status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos</SelectItem>
              <SelectItem value="pending">Pendente</SelectItem>
              <SelectItem value="scheduled">Agendado</SelectItem>
              <SelectItem value="paid">Pago</SelectItem>
              <SelectItem value="overdue">Vencido</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={categoriaFilter}
            onValueChange={onCategoriaFilterChange}
          >
            <SelectTrigger className="w-45">
              <SelectValue placeholder="Selecione a categoria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todas">Todas</SelectItem>
              {categorias.map((categoria) => (
                <SelectItem key={categoria} value={categoria}>
                  {categoria}
                </SelectItem>
              ))}
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
      </CardContent>
    </Card>
  );
}
