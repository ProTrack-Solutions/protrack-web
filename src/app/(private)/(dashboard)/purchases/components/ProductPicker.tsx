"use client";

import { useEffect, useState } from "react";
import { Grid3x3, Plus, Search, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useCatalogProducts } from "@/hooks/usePurchases";
import { CatalogProduct } from "@/interfaces/purchases.interface";
import { money } from "./format";

function useDebouncedValue<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

interface ProductPickerProps {
  /** Produtos já no pedido aparecem marcados */
  selectedIds: string[];
  onSelect: (product: CatalogProduct) => void;
  /** Abre a grade de recompra de um modelo */
  onSelectModel: (modelName: string) => void;
  /** Abre o cadastro rápido com o texto buscado como nome */
  onCreateNew: (name: string) => void;
}

/** Busca de produtos do pedido com atalhos de grade e de cadastro rápido */
export function ProductPicker({
  selectedIds,
  onSelect,
  onSelectModel,
  onCreateNew,
}: ProductPickerProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const debounced = useDebouncedValue(search.trim(), 300);

  const { products, models, loading, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useCatalogProducts(debounced);

  const searching = search.trim() !== debounced || loading;

  const close = () => {
    setOpen(false);
    setSearch("");
  };

  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;
    if (scrollHeight - scrollTop - clientHeight < 48 && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  return (
    <Popover open={open} onOpenChange={(next) => (next ? setOpen(true) : close())}>
      <PopoverTrigger asChild>
        <Button type="button" variant="outline" className="h-9 cursor-pointer">
          <Plus className="h-4 w-4" />
          Adicionar produto
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[min(30rem,calc(100vw-2rem))] p-0" align="start">
        <div className="border-b p-2">
          <div className="relative">
            <Search className="absolute top-1/2 left-2.5 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              autoFocus
              placeholder="Buscar por nome ou código de barras"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-9 pl-8"
            />
          </div>
        </div>

        <div className="max-h-80 overflow-y-auto p-1" onScroll={handleScroll}>
          {models.length > 0 && (
            <div className="mb-1 border-b border-border pb-1">
              {models.map((model) => (
                <button
                  key={model.model_name}
                  type="button"
                  onClick={() => {
                    onSelectModel(model.model_name);
                    close();
                  }}
                  className="flex w-full cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-left text-sm hover:bg-slate-100 dark:hover:bg-muted"
                >
                  <Grid3x3 className="h-4 w-4 shrink-0 text-blue-700 dark:text-blue-300" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-medium">Adicionar grade de {model.model_name}</span>
                    <span className="block text-xs text-muted-foreground">
                      {model.variations} variações · escolha a quantidade de cada uma
                    </span>
                  </span>
                </button>
              ))}
            </div>
          )}

          {searching && products.length === 0 ? (
            <p className="py-6 text-center text-xs text-muted-foreground">Buscando produtos...</p>
          ) : products.length === 0 ? (
            <p className="py-4 text-center text-xs text-muted-foreground">Nenhum produto encontrado.</p>
          ) : (
            products.map((product) => {
              const added = selectedIds.includes(product.id);
              return (
                <button
                  key={product.id}
                  type="button"
                  disabled={added}
                  onClick={() => {
                    onSelect(product);
                    close();
                  }}
                  className="flex w-full cursor-pointer items-center justify-between gap-3 rounded-md px-2 py-2 text-left text-sm hover:bg-slate-100 dark:hover:bg-muted disabled:cursor-default disabled:opacity-50 disabled:hover:bg-transparent"
                >
                  <span className="min-w-0">
                    <span className="block truncate font-medium">{product.name}</span>
                    <span className="block text-xs text-muted-foreground">
                      {product.sell_in_bulk ? "Granel" : `Estoque: ${product.quantity}`} · custo{" "}
                      {money(product.cost_price)}
                    </span>
                  </span>
                  {added && <span className="shrink-0 text-xs text-muted-foreground">no pedido</span>}
                </button>
              );
            })
          )}
          {isFetchingNextPage && (
            <p className="py-2 text-center text-xs text-muted-foreground">Carregando mais...</p>
          )}
        </div>

        <div className="border-t p-1">
          <button
            type="button"
            onClick={() => {
              onCreateNew(search.trim());
              close();
            }}
            className="flex w-full cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-left text-sm font-medium text-blue-700 dark:text-blue-300 hover:bg-primary/10"
          >
            <Sparkles className="h-4 w-4" />
            {search.trim() ? `Cadastrar "${search.trim()}" como produto novo` : "Cadastrar produto novo"}
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
