import { useFormContext, useFieldArray, useWatch } from "react-hook-form";
import { ChevronDown, Plus, Search, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { CreateSaleParams } from "@/interfaces/sale.interface";
import { Product } from "@/interfaces/products.interface";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface ProductSearchSelectProps {
  value?: string;
  onChange: (value: string) => void;
  products: Product[];
  productSearch: string;
  onProductSearchChange?: (value: string) => void;
  onReachEnd?: () => void;
  hasMore?: boolean;
  isLoadingMore?: boolean;
  isSearchingProducts?: boolean;
}

function ProductSearchSelect({
  value,
  onChange,
  products,
  productSearch,
  onProductSearchChange,
  onReachEnd,
  hasMore,
  isLoadingMore,
  isSearchingProducts = false,
}: ProductSearchSelectProps) {
  const [open, setOpen] = useState(false);

  const selectedProduct = products.find((product) => product.id === value);

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
            {selectedProduct ? (
              `${selectedProduct.name} - R$ ${selectedProduct.sale_price.toFixed(2)} (Est: ${selectedProduct.quantity})`
            ) : (
              <span className="text-muted-foreground">Selecione o produto</span>
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
              placeholder="Buscar produto..."
              value={productSearch}
              onChange={(event) => onProductSearchChange?.(event.target.value)}
              className="h-8 pl-8"
            />
          </div>
        </div>
        <div className="max-h-60 overflow-y-auto p-1" onScroll={handleScroll}>
          {isSearchingProducts && products.length === 0 ? (
            <div className="py-4 text-center text-xs text-muted-foreground">
              Buscando produtos...
            </div>
          ) : (
            products.map((produto) => (
              <button
                key={produto.id}
                type="button"
                className={cn(
                  "flex w-full cursor-default items-center rounded-md px-2 py-1.5 text-left text-sm outline-none hover:bg-accent hover:text-accent-foreground",
                  value === produto.id && "bg-accent text-accent-foreground",
                )}
                onClick={() => {
                  onChange(produto.id);
                  setOpen(false);
                }}
              >
                {produto.name} - R$ {produto.sale_price.toFixed(2)} (Est:{" "}
                {produto.quantity})
              </button>
            ))
          )}
          {!isSearchingProducts && products.length === 0 && (
            <div className="py-4 text-center text-xs text-muted-foreground">
              Nenhum produto encontrado.
            </div>
          )}
          {isLoadingMore && (
            <div className="py-2 text-center text-xs text-muted-foreground">
              Carregando mais produtos...
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}

interface Props {
  products: Product[];
  onReachEnd?: () => void;
  hasMore?: boolean;
  isLoadingMore?: boolean;
  productSearch?: string;
  onProductSearchChange?: (value: string) => void;
  onProductSelected?: (product: Product) => void;
  isSearchingProducts?: boolean;
}

export function SaleProductsTable({
  products,
  onReachEnd,
  hasMore,
  isLoadingMore,
  productSearch = "",
  onProductSearchChange,
  onProductSelected,
  isSearchingProducts = false,
}: Props) {
  const { control, setValue } = useFormContext<CreateSaleParams>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const watchedProdutos = useWatch({ control, name: "items" }) ?? [];

  const [valoresProdutos, setValoresProdutos] = useState<
    Record<string, number>
  >({});

  const [selectedProductsByRow, setSelectedProductsByRow] = useState<
    Record<number, Product>
  >({});

  const getDisplayProducts = (index: number, selectedProductId?: string) => {
    const selectedProduct =
      selectedProductsByRow[index] ??
      products.find((product) => product.id === selectedProductId);

    if (
      selectedProduct &&
      !products.some((product) => product.id === selectedProduct.id)
    ) {
      return [selectedProduct, ...products];
    }

    return products;
  };

  const handleProdutoChange = (index: number, produtoId: string) => {
    const produto = products.find((p) => p.id === produtoId);
    const selectedProduct = selectedProductsByRow[index];
    const resolvedProduct =
      produto ??
      (selectedProduct?.id === produtoId ? selectedProduct : undefined);

    if (resolvedProduct) {
      setValue(`items.${index}.product_id`, resolvedProduct.id);
      const fieldKey = `items.${index}.product_id`;

      setSelectedProductsByRow((prev) => ({
        ...prev,
        [index]: resolvedProduct,
      }));
      onProductSelected?.(resolvedProduct);

      setValoresProdutos((prev) => ({
        ...prev,
        [fieldKey]: resolvedProduct.sale_price,
      }));
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Produtos da Venda</CardTitle>
        <Button
          type="button"
          size="sm"
          onClick={() => append({ product_id: "", quantity: 1 })}
        >
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Produto
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Produto</TableHead>
              <TableHead className="w-24">Quantidade</TableHead>
              <TableHead className="w-32">Preço Unit.</TableHead>
              <TableHead className="w-32">Subtotal</TableHead>
              <TableHead className="w-16">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {fields.map((field, index) => (
              <TableRow key={field.id}>
                <TableCell>
                  <FormField
                    control={control}
                    name={`items.${index}.product_id`}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <ProductSearchSelect
                            value={field.value}
                            onChange={(value) => {
                              field.onChange(value);
                              handleProdutoChange(index, value);
                            }}
                            products={getDisplayProducts(index, field.value)}
                            productSearch={productSearch}
                            onProductSearchChange={onProductSearchChange}
                            onReachEnd={onReachEnd}
                            hasMore={hasMore}
                            isLoadingMore={isLoadingMore}
                            isSearchingProducts={isSearchingProducts}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TableCell>

                <TableCell>
                  <FormField
                    control={control}
                    name={`items.${index}.quantity`}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            type="number"
                            min="1"
                            {...field}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TableCell>

                <TableCell>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    value={valoresProdutos[`items.${index}.product_id`] || ""}
                    disabled
                  />
                </TableCell>

                <TableCell>
                  <span className="font-medium">
                    R${" "}
                    {(
                      (watchedProdutos[index]?.quantity || 0) *
                      (valoresProdutos[`items.${index}.product_id`] || 0)
                    ).toFixed(2)}
                  </span>
                </TableCell>

                <TableCell>
                  {fields.length > 1 && (
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => remove(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
