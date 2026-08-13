import { useFormContext } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { CreateSaleParams } from "@/interfaces/sale.interface";
import { Client } from "@/interfaces/client.interface";

interface Props {
  clients: Client[];
  onReachEnd?: () => void;
  hasMore?: boolean;
  isLoadingMore?: boolean;
}

export function SaleInfoCard({
  clients,
  onReachEnd,
  hasMore,
  isLoadingMore,
}: Props) {
  const { control } = useFormContext<CreateSaleParams>();

  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;
    const isNearEnd = scrollHeight - scrollTop - clientHeight < 48;

    if (isNearEnd && hasMore && !isLoadingMore) {
      onReachEnd?.();
    }
  };

  return (
    <Card className="flex-1">
      <CardHeader>
        <CardTitle>Informações da Venda</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormField
          control={control}
          name="customer_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cliente</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione o cliente" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent onScroll={handleScroll}>
                  {clients.map((cliente) => (
                    <SelectItem key={cliente.id} value={cliente.id}>
                      {cliente.full_name} - {cliente.email}
                    </SelectItem>
                  ))}
                  {isLoadingMore && (
                    <div className="py-2 text-center text-xs text-muted-foreground">
                      Carregando mais clientes...
                    </div>
                  )}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <Input
          type="date"
          value={new Date().toISOString().split("T")[0]}
          disabled
        />
      </CardContent>
    </Card>
  );
}
