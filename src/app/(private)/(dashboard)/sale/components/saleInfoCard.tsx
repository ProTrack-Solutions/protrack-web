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
}

export function SaleInfoCard({ clients }: Props) {
  const { control } = useFormContext<CreateSaleParams>();

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
                <SelectContent>
                  {clients.map((cliente) => (
                    <SelectItem key={cliente.id} value={cliente.id}>
                      {cliente.full_name} - {cliente.email}
                    </SelectItem>
                  ))}
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
