import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
    value: "criacao",
    label: "Data de criação",
    hint: "Quando a conta foi lançada",
  },
];

interface FiltrosContasProps {
  searchTerm: string;
  onSearchTermChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  filter: FiltrosReceber;
  onApplyFilter: (filtros: FiltrosReceber) => void;
}

export function BillsFilters({
  searchTerm,
  onSearchTermChange,
  statusFilter,
  onStatusFilterChange,
  filter,
  onApplyFilter,
}: FiltrosContasProps) {
  const [filterOpen, setFilterOpen] = useState(false);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Filtros e Pesquisa</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Pesquisar..."
                value={searchTerm}
                onChange={(e) => onSearchTermChange(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
          {/* onValueChange do Select recebe a string do valor diretamente, não um evento DOM */}
          <Select value={statusFilter} onValueChange={onStatusFilterChange}>
            <SelectTrigger className="w-45">
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos</SelectItem>
              <SelectItem value="pending">Pendente</SelectItem>
              <SelectItem value="partial">Parcial</SelectItem>
              <SelectItem value="paid">Pago</SelectItem>
              <SelectItem value="overdue">Vencido</SelectItem>
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
