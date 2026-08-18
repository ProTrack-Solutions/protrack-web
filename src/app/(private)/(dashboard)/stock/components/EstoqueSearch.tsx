import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Tag } from "lucide-react";
import FilterPopOver, { FiltrosReceber } from "@/components/FilterPopOver";

const types: { value: string; label: string; hint: string }[] = [
  {
    value: "criacao",
    label: "Data de criação",
    hint: "Quando a venda foi lançada",
  },
];

interface EstoqueSearchProps {
  searchText: string;
  onSearchTextChange: (value: string) => void;
  onSearchChange: (value: string) => void;
  handleGenerateLabel: () => void;
  onApplyFilter: (filtros: FiltrosReceber) => void;
  filter: FiltrosReceber;
}

export function EstoqueSearch({
  searchText,
  onSearchTextChange,
  onSearchChange,
  handleGenerateLabel,
  onApplyFilter,
  filter,
}: EstoqueSearchProps) {
  const [filterOpen, setFilterOpen] = useState(false);

  const handleInputChange = (value: string) => {
    onSearchTextChange(value);

    // Quando o campo é totalmente apagado, volta para a consulta sem filtro
    if (value.trim() === "") {
      onSearchChange("");
    }
  };

  return (
    <Card className="border-border/50">
      <CardContent className="p-4 flex flex-col sm:flex-row gap-3">
        <Button
          className="h-11 gap-2 bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
          onClick={() => onSearchChange(searchText)}
        >
          <Search className="w-4 h-4" />
          Buscar
        </Button>
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Pesquisar por nome ou código de barras..."
            value={searchText}
            onChange={(e) => handleInputChange(e.target.value)}
            className="pl-10 h-11 bg-background border-border focus-visible:ring-blue-500/30"
          />
        </div>

        <FilterPopOver
          open={filterOpen}
          onOpenChange={setFilterOpen}
          value={filter}
          onApply={onApplyFilter}
          types={types}
        />

        <Button
          className="h-11 gap-2 bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
          onClick={handleGenerateLabel}
        >
          <Tag className="w-4 h-4" />
          Gerar etiquetas
        </Button>
      </CardContent>
    </Card>
  );
}
