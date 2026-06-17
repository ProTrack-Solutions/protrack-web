import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Filter, Search, TrendingUp } from "lucide-react";

interface EstoqueSearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export function EstoqueSearch({
  searchTerm,
  onSearchChange,
}: EstoqueSearchProps) {
  return (
    <Card className="border-border/50">
      <CardContent className="p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Pesquise por nome, código ou categoria..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 h-11 bg-background border-border focus-visible:ring-blue-500/30"
          />
        </div>
        <Button variant="outline" className="h-11 gap-2">
          <Filter className="w-4 h-4" />
          Filtros
        </Button>
        <Button className="h-11 gap-2 bg-blue-600 hover:bg-blue-700 text-white">
          <TrendingUp className="w-4 h-4" />
          Relatório
        </Button>
      </CardContent>
    </Card>
  );
}
