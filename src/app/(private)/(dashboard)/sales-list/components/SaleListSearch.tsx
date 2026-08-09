import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import FilterPopOver, { FiltrosReceber } from "@/components/FilterPopOver";
import { PaymentMethod } from "@/enum/methodPayments";
import { getPaymentMethodLabel } from "@/utils/paymentMethodFormat";

const types: { value: string; label: string; hint: string }[] = [
  {
    value: "venda",
    label: "Data da venda",
    hint: "Quando a venda foi realizada",
  },
];

interface SaleListSearchProps {
  search: string;
  setSearch: (value: string) => void;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  paymentMethodFilter: string;
  setPaymentMethodFilter: (value: string) => void;
  filter: FiltrosReceber;
  onApplyFilter: (filtros: FiltrosReceber) => void;
}

export const SaleListSearch = ({
  search,
  setSearch,
  statusFilter,
  setStatusFilter,
  paymentMethodFilter,
  setPaymentMethodFilter,
  filter,
  onApplyFilter,
}: SaleListSearchProps) => {
  const [filterOpen, setFilterOpen] = useState(false);

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Pesquisar por cliente ou nº da venda..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-45">
              <SelectValue placeholder="Selecione o status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os Status</SelectItem>
              <SelectItem value="paid">Pago</SelectItem>
              <SelectItem value="pending">Pendente</SelectItem>
              <SelectItem value="overdue">Atrasado</SelectItem>
              <SelectItem value="partial">Parcial</SelectItem>
              <SelectItem value="canceled">Cancelado</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={paymentMethodFilter}
            onValueChange={setPaymentMethodFilter}
          >
            <SelectTrigger className="w-full sm:w-45">
              <SelectValue placeholder="Selecione a forma de pagamento" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todas as Formas</SelectItem>
              {Object.values(PaymentMethod).map((method) => (
                <SelectItem key={method} value={method}>
                  {getPaymentMethodLabel(method)}
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
};
