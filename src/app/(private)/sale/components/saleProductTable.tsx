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
import { VendaForm } from "@/@types/sale.type";
import { produtos as produtosList } from "../sale.data";

export function SaleProductsTable() {
  const { control, setValue } = useFormContext<VendaForm>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "produtos",
  });

  const watchedProdutos = useWatch({ control, name: "produtos" });

  const handleProdutoChange = (index: number, produtoId: string) => {
    const produto = produtosList.find((p) => p.id === produtoId);
    if (produto) {
      setValue(`produtos.${index}.precoUnitario`, produto.preco);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Produtos da Venda</CardTitle>
        <Button
          type="button"
          size="sm"
          onClick={() =>
            append({ produtoId: "", quantidade: 1, precoUnitario: 0 })
          }
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
                    name={`produtos.${index}.produtoId`}
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
                            {produtosList.map((produto) => (
                              <SelectItem key={produto.id} value={produto.id}>
                                {produto.nome} - R$ {produto.preco.toFixed(2)}{" "}
                                (Est: {produto.estoque})
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
                    name={`produtos.${index}.quantidade`}
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
                  <FormField
                    control={control}
                    name={`produtos.${index}.precoUnitario`}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            min="0"
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
                  <span className="font-medium">
                    R${" "}
                    {(
                      (watchedProdutos[index]?.quantidade || 0) *
                      (watchedProdutos[index]?.precoUnitario || 0)
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
