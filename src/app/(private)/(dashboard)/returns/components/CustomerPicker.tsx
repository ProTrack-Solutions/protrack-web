"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronsUpDown, Search, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useInfiniteClients } from "@/hooks/useInfiniteClients";

function useDebouncedValue<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

/** Cliente que recebe o vale-troca quando a venda não tinha cliente */
export function CustomerPicker({
  value,
  onChange,
}: {
  value: { id: string; name: string } | null;
  onChange: (customer: { id: string; name: string }) => void;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const debounced = useDebouncedValue(search.trim(), 300);
  const { clients, loading, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useInfiniteClients(debounced || undefined);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button type="button" variant="outline" className="h-10 w-full cursor-pointer justify-between font-normal">
          <span className={value ? "text-foreground" : "text-muted-foreground"}>
            {value ? value.name : "Escolha o cliente"}
          </span>
          <ChevronsUpDown className="h-4 w-4 opacity-60" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[min(24rem,calc(100vw-2rem))] p-0" align="start">
        <div className="border-b border-border p-2">
          <div className="relative">
            <Search className="absolute top-1/2 left-2.5 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              autoFocus
              placeholder="Nome ou CPF"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-9 pl-8"
            />
          </div>
        </div>
        <div
          className="max-h-64 overflow-y-auto p-1"
          onScroll={(e) => {
            const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
            if (scrollHeight - scrollTop - clientHeight < 48 && hasNextPage && !isFetchingNextPage) {
              fetchNextPage();
            }
          }}
        >
          {loading ? (
            <p className="py-6 text-center text-xs text-muted-foreground">Buscando clientes...</p>
          ) : clients.length === 0 ? (
            <p className="py-6 text-center text-xs text-muted-foreground">Nenhum cliente encontrado.</p>
          ) : (
            clients.map((client) => (
              <button
                key={client.id}
                type="button"
                onClick={() => {
                  onChange({ id: client.id, name: client.full_name });
                  setOpen(false);
                }}
                className="flex w-full cursor-pointer flex-col items-start rounded-md px-2 py-2 text-left text-sm hover:bg-slate-100 dark:hover:bg-muted"
              >
                <span className="font-medium">{client.full_name}</span>
                {client.cpf && <span className="text-xs text-muted-foreground">{client.cpf}</span>}
              </button>
            ))
          )}
        </div>
        <div className="border-t border-border p-1">
          <Link
            href="/client-registration"
            target="_blank"
            className="flex items-center gap-2 rounded-md px-2 py-2 text-sm font-medium text-blue-700 hover:bg-slate-100 dark:text-blue-300 dark:hover:bg-muted"
          >
            <UserPlus className="h-4 w-4" />
            Cadastrar cliente (abre em nova aba)
          </Link>
        </div>
      </PopoverContent>
    </Popover>
  );
}
