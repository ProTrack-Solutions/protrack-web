import { Button } from "@/components/ui/button";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { FiltrosForm } from "./components/FiltrosForm";
import { Filter } from "lucide-react";

export interface FiltrosReceber {
  typeDate: string;
  startDate?: Date;
  endDate?: Date;
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  value: FiltrosReceber;
  onApply: (filtros: FiltrosReceber) => void;
  types: { value: string; label: string; hint: string }[];
}

const FilterPopOver = ({
  open,
  onOpenChange,
  value,
  onApply,
  types,
}: Props) => {
  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Filter className="h-4 w-4" />
          Mais Filtros
        </Button>
      </PopoverTrigger>

      <PopoverContent
        className="w-95 sm:w-110 p-4"
        side="right"
        align="center"
        sideOffset={8}
      >
        {open && (
          <FiltrosForm
            value={value}
            onApply={onApply}
            onClose={() => onOpenChange(false)}
            types={types}
          />
        )}
      </PopoverContent>
    </Popover>
  );
};

export default FilterPopOver;
