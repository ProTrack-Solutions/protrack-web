import { Search } from "lucide-react";
import { Card } from "../ui/card";
import { Input } from "../ui/input";

interface Props {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
}

export const FilterShearch = ({ searchTerm, setSearchTerm }: Props) => {
  return (
    <Card className="p-4">
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome, email, CPF/CNPJ ou telefone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>
    </Card>
  );
};
