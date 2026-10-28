"use client";

import { useEffect, useState } from "react";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useInfiniteProducts } from "@/hooks/useInfiniteProducts";
import { Product } from "@/interfaces/products.interface";
import { money } from "./format";

function useDebouncedValue<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

/** Busca dos produtos que o cliente leva na troca */
export function ProductPicker({
  selectedIds,
  onSelect,
}: {
  selectedIds: string[];
  onSelect: (product: Product) => void;
}) {
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
        <Button type="button" variant="outline" className="h-9 cursor-pointer">
          <Plus className="h-4 w-4" />
          Adicionar produto
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[min(28rem,calc(100vw-2rem))] p-0" align="start">
        <div className="border-b border-border p-2">
          <div className="relative">
            <Search className="absolute top-1/2 left-2.5 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              autoFocus
              placeholder="Buscar produto"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-9 pl-8"
            />
          </div>
        </div>
        <div
          className="max-h-80 overflow-y-auto p-1"
          onScroll={(e) => {
            const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
            if (scrollHeight - scrollTop - clientHeight < 48 && hasNextPage && !isFetchingNextPage) {
              fetchNextPage();
            }
          }}
        >
          {searching && products.length === 0 ? (
            <p className="py-6 text-center text-xs text-muted-foreground">Buscando produtos...</p>
          ) : products.length === 0 ? (
            <p className="py-6 text-center text-xs text-muted-foreground">Nenhum produto encontrado.</p>
          ) : (
            products.map((product) => {
              const added = selectedIds.includes(product.id);
              const outOfStock = !product.sell_in_bulk && product.quantity <= 0;
              return (
                <button
                  key={product.id}
                  type="button"
                  disabled={added || outOfStock}
                  onClick={() => {
                    onSelect(product);
                    close();
                  }}
                  className="flex w-full cursor-pointer items-center justify-between gap-3 rounded-md px-2 py-2 text-left text-sm hover:bg-slate-100 disabled:cursor-default disabled:opacity-50 disabled:hover:bg-transparent dark:hover:bg-muted"
                >
                  <span className="min-w-0">
                    <span className="block truncate font-medium">{product.name}</span>
                    <span className="block text-xs text-muted-foreground">
                      {product.sell_in_bulk ? "Granel" : `Estoque: ${product.quantity}`}
                    </span>
                  </span>
                  <span className="shrink-0 text-right text-xs">
                    <span className="block font-semibold tabular-nums text-foreground">{money(product.sale_price)}</span>
                    {added ? (
                      <span className="text-muted-foreground">na troca</span>
                    ) : outOfStock ? (
                      <span className="text-red-700 dark:text-red-400">sem estoque</span>
                    ) : null}
                  </span>
                </button>
              );
            })
          )}
          {isFetchingNextPage && (
            <p className="py-2 text-center text-xs text-muted-foreground">Carregando mais...</p>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
