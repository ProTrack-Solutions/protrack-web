import { useFormContext, useFieldArray, useWatch } from "react-hook-form";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

interface Props {
  products: Product[];
}

export function SaleProductsTable({ products }: Props) {
  const { control, setValue } = useFormContext<CreateSaleParams>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const watchedProdutos = useWatch({ control, name: "items" }) ?? [];

  const [valoresProdutos, setValoresProdutos] = useState<
    Record<string, number>
  >({});

  console.log("valoresProdutos", valoresProdutos);


  const handleProdutoChange = (index: number, produtoId: string) => {
    const produto = products.find((p) => p.id === produtoId);
    if (produto) {
      setValue(`items.${index}.product_id`, produto.id);
      const i = `items.${index}.product_id`;

      setValoresProdutos((prev) => ({
        ...prev,
        [i]: produto.sale_price,
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
                        <Select
                          onValueChange={(value) => {
                            field.onChange(value);
                            handleProdutoChange(index, value);
                          }}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Selecione o produto" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {products.map((produto) => (
                              <SelectItem key={produto.id} value={produto.id}>
                                {produto.name} - R${" "}
                                {produto.sale_price.toFixed(2)} (Est:{" "}
                                {produto.quantity})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
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
                    {...field}
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
