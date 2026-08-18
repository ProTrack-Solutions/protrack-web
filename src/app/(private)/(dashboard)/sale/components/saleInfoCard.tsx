import { useFormContext, useWatch } from "react-hook-form";
import { ChevronDown, Search } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { CreateSaleParams } from "@/interfaces/sale.interface";
import { Client } from "@/interfaces/client.interface";
import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { formatDocument } from "@/utils/documentFormat";

interface ClientSearchSelectProps {
  value?: string;
  onChange: (value: string) => void;
  clients: Client[];
  clientSearch: string;
  onClientSearchChange?: (value: string) => void;
  onReachEnd?: () => void;
  hasMore?: boolean;
  isLoadingMore?: boolean;
  isSearchingClients?: boolean;
  onClientSelected?: (client: Client) => void;
}

function ClientSearchSelect({
  value,
  onChange,
  clients,
  clientSearch,
  onClientSearchChange,
  onReachEnd,
  hasMore,
  isLoadingMore,
  isSearchingClients = false,
  onClientSelected,
}: ClientSearchSelectProps) {
  const [open, setOpen] = useState(false);

  const selectedClient = clients?.find((client) => client?.id === value);

  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;
    const isNearEnd = scrollHeight - scrollTop - clientHeight < 48;

    if (isNearEnd && hasMore && !isLoadingMore) {
      onReachEnd?.();
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="h-8 w-full justify-between font-normal"
        >
          <span className="truncate">
            {selectedClient ? (
              `${selectedClient.full_name} - ${formatDocument(selectedClient.cpf)}`
            ) : (
              <span className="text-muted-foreground">Selecione o cliente</span>
            )}
          </span>
          <ChevronDown className="size-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-(--radix-popover-trigger-width) p-0"
        align="start"
      >
        <div className="border-b p-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              autoFocus
              placeholder="Buscar por nome ou CPF..."
              value={clientSearch}
              onChange={(event) => onClientSearchChange?.(event.target.value)}
              className="h-8 pl-8"
            />
          </div>
        </div>
        <div className="max-h-60 overflow-y-auto p-1" onScroll={handleScroll}>
          {isSearchingClients && clients.length === 0 ? (
            <div className="py-4 text-center text-xs text-muted-foreground">
              Buscando clientes...
            </div>
          ) : (
            clients.map((cliente) => (
              <button
                key={cliente?.id}
                type="button"
                className={cn(
                  "flex w-full cursor-default items-center rounded-md px-2 py-1.5 text-left text-sm outline-none hover:bg-accent hover:text-accent-foreground",
                  value === cliente?.id && "bg-accent text-accent-foreground",
                )}
                onClick={() => {
                  onChange(cliente?.id);
                  onClientSelected?.(cliente);
                  setOpen(false);
                }}
              >
                {cliente?.full_name} - {formatDocument(cliente?.cpf)}
              </button>
            ))
          )}
          {!isSearchingClients && clients.length === 0 && (
            <div className="py-4 text-center text-xs text-muted-foreground">
              Nenhum cliente encontrado.
            </div>
          )}
          {isLoadingMore && (
            <div className="py-2 text-center text-xs text-muted-foreground">
              Carregando mais clientes...
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}

interface Props {
  clients: Client[];
  onReachEnd?: () => void;
  hasMore?: boolean;
  isLoadingMore?: boolean;
  clientSearch?: string;
  onClientSearchChange?: (value: string) => void;
  onClientSelected?: (client: Client) => void;
  isSearchingClients?: boolean;
}

export function SaleInfoCard({
  clients,
  onReachEnd,
  hasMore,
  isLoadingMore,
  clientSearch = "",
  onClientSearchChange,
  onClientSelected,
  isSearchingClients = false,
}: Props) {
  const { control } = useFormContext<CreateSaleParams>();
  const [manuallySelectedClient, setManuallySelectedClient] =
    useState<Client | null>(null);
  const customerId = useWatch({ control, name: "customer_id" });

  // Derived, not stored: if there's no customerId, there's no selected client.
  const selectedClient = customerId ? manuallySelectedClient : null;

  const displayClients = useMemo(() => {
    if (
      selectedClient &&
      !clients.some((client) => client.id === selectedClient.id)
    ) {
      return [selectedClient, ...clients];
    }
    return clients;
  }, [clients, selectedClient]);

  const handleClientSelected = (client: Client) => {
    setManuallySelectedClient(client);
    onClientSelected?.(client);
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
              <FormControl>
                <ClientSearchSelect
                  value={field.value}
                  onChange={field.onChange}
                  clients={displayClients}
                  clientSearch={clientSearch}
                  onClientSearchChange={onClientSearchChange}
                  onReachEnd={onReachEnd}
                  hasMore={hasMore}
                  isLoadingMore={isLoadingMore}
                  isSearchingClients={isSearchingClients}
                  onClientSelected={handleClientSelected}
                />
              </FormControl>
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
