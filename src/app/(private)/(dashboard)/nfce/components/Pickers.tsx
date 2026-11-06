"use client";

import { useEffect, useState } from "react";
import { Plus, Search, UserSearch } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { brl } from "@/components/DashCard";
import { useInfiniteProducts } from "@/hooks/useInfiniteProducts";
import { useInfiniteClients } from "@/hooks/useInfiniteClients";
import { Product } from "@/interfaces/products.interface";
import { Client } from "@/interfaces/client.interface";

function useDebouncedValue<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

const loadMore =
  (hasNextPage: boolean, isFetchingNextPage: boolean, fetchNextPage: () => void) =>
  (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollHeight - scrollTop - clientHeight < 48 && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

/** Busca no catálogo. A nota manual não mexe no estoque: produto sem estoque também entra. */
export function ProductSearch({ onSelect }: { onSelect: (product: Product) => void }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const debounced = useDebouncedValue(search.trim(), 300);
  const { products, loading, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useInfiniteProducts(debounced || undefined);
  const searching = search.trim() !== debounced || loading;

  const close = () => {
    setOpen(false);
    setSearch("");
  };

  return (
    <Popover open={open} onOpenChange={(next) => (next ? setOpen(true) : close())}>
      <PopoverTrigger asChild>
        <Button type="button" variant="outline" size="sm" className="cursor-pointer">
          <Plus className="h-4 w-4" />
          Adicionar produto
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[min(28rem,calc(100vw-2rem))] p-0" align="end">
        <div className="border-b border-border p-2">
          <div className="relative">
            <Search className="absolute top-1/2 left-2.5 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              autoFocus
              placeholder="Nome ou código de barras"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-9 pl-8"
            />
          </div>
        </div>
        <div
          className="max-h-80 overflow-y-auto p-1"
          onScroll={loadMore(hasNextPage, isFetchingNextPage, fetchNextPage)}
        >
          {searching && products.length === 0 ? (
            <p className="py-6 text-center text-xs text-muted-foreground">Buscando produtos...</p>
          ) : products.length === 0 ? (
            <p className="py-6 text-center text-xs text-muted-foreground">Nenhum produto encontrado.</p>
          ) : (
            products.map((product) => (
              <button
                key={product.id}
                type="button"
                onClick={() => {
                  onSelect(product);
                  close();
                }}
                className="flex w-full cursor-pointer items-center justify-between gap-3 rounded-md px-2 py-2 text-left text-sm hover:bg-slate-100 dark:hover:bg-muted"
              >
                <span className="min-w-0">
                  <span className="block truncate font-medium">{product.name}</span>
                  <span className="block text-xs text-muted-foreground">
                    {product.barcode || "sem código"} · {product.unit || "UN"}
                  </span>
                </span>
                <span className="shrink-0 text-xs font-semibold tabular-nums">
                  {brl(product.sale_price)}
                </span>
              </button>
            ))
          )}
          {isFetchingNextPage && (
            <p className="py-2 text-center text-xs text-muted-foreground">Carregando mais...</p>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}

/** Preenche o destinatário com um cliente cadastrado */
export function CustomerSearch({ onSelect }: { onSelect: (client: Client) => void }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const debounced = useDebouncedValue(search.trim(), 300);
  const { clients, loading, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useInfiniteClients(debounced || undefined);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button type="button" variant="outline" size="sm" className="cursor-pointer">
          <UserSearch className="h-4 w-4" />
          Usar cliente cadastrado
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[min(24rem,calc(100vw-2rem))] p-0" align="end">
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
          onScroll={loadMore(hasNextPage, isFetchingNextPage, fetchNextPage)}
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
                  onSelect(client);
                  setOpen(false);
                  setSearch("");
                }}
                className="flex w-full cursor-pointer flex-col items-start rounded-md px-2 py-2 text-left text-sm hover:bg-slate-100 dark:hover:bg-muted"
              >
                <span className="font-medium">{client.full_name}</span>
                <span className="text-xs text-muted-foreground">
                  {[client.cpf, client.address_city && `${client.address_city}/${client.address_state}`]
                    .filter(Boolean)
                    .join(" · ")}
                </span>
              </button>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
