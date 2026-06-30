"use client";

import { useState, useMemo } from "react";
import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Barcode,
  Boxes,
  DollarSign,
  Info,
  Percent,
  Ruler,
  Save,
  Tag,
  TrendingUp,
} from "lucide-react";
import { toast } from "sonner";
import { useProductsCategories } from "@/hooks/useProductsCategories";
import { Product, ProductUpdateParams } from "@/interfaces/stock.interface";
import { UpdateProcut } from "@/service/products.service";
import { useProducts } from "@/hooks/useProducts";

interface DialogEditProductProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product;
}

export const DialogEditProduct = ({
  open,
  onOpenChange,
  product,
}: DialogEditProductProps) => {
  const [formData, setFormData] = useState<ProductUpdateParams>(
    () =>
      product ?? {
        barcode: "",
        category_id: "",
        cost_price: 0,
        description: "",
        name: "",
        quantity: 0,
        sale_price: 0,
        size: "",
      },
  );

  const handleChange = (
    field: keyof ProductUpdateParams,
    value: string | number,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const { productsCategories } = useProductsCategories();

  const { margemValor, margemPercent } = useMemo(() => {
    const custo = formData.cost_price || 0;
    const venda = formData.sale_price || 0;
    const margemValor = venda - custo;
    const margemPercent = custo > 0 ? (margemValor / custo) * 100 : 0;
    return { margemValor, margemPercent };
  }, [formData.cost_price, formData.sale_price]);

  const margemTone =
    margemPercent >= 50
      ? "from-emerald-500 to-teal-600"
      : margemPercent >= 20
        ? "from-blue-500 to-indigo-600"
        : margemPercent > 0
          ? "from-amber-500 to-orange-500"
          : "from-rose-500 to-rose-600";

  const { refetch } = useProducts();

  const handleUpdateProduct = async () => {
    try {
      await UpdateProcut(product?.id, formData);
      toast.success("Produto atualizado com socesso!");
    } catch (error) {
      console.log(error);
      toast.error("Erro ao atualizar produto!");
    } finally {
      refetch();
      onOpenChange(false);
    }
  };

  const categoriaLabel =
    productsCategories?.find((c) => c.id === formData.category_id)?.name || "";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="min-w-3xl max-h-[90vh] overflow-y-auto p-0 gap-0">
        <form className="p-6 space-y-6">
          {/* Informações básicas */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-sm">
                <Info className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground">
                  Informações básicas
                </h3>
                <p className="text-xs text-muted-foreground">
                  Dados gerais de identificação
                </p>
              </div>
            </div>
            <Separator />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="edit-name" className="text-sm font-medium">
                  Nome do produto <span className="text-rose-500">*</span>
                </Label>
                <Input
                  id="edit-name"
                  placeholder="Ex: Camiseta Premium Algodão"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-category" className="text-sm font-medium">
                  Categoria <span className="text-rose-500">*</span>
                </Label>
                <Select
                  value={formData.category_id}
                  onValueChange={(v) => handleChange("category_id", v)}
                >
                  <SelectTrigger id="edit: " className="h-11">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {productsCategories?.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="edit-barcode"
                  className="text-sm font-medium flex items-center gap-1.5"
                >
                  <Barcode className="w-3.5 h-3.5 text-muted-foreground" />
                  Código de barras
                </Label>
                <Input
                  id="edit-barcode"
                  placeholder="0000000000000"
                  value={formData.barcode}
                  onChange={(e) => handleChange("barcode", e.target.value)}
                  className="h-11 font-mono"
                />
              </div>

              <div className="md:col-span-2 space-y-2">
                <Label
                  htmlFor="edit-description"
                  className="text-sm font-medium"
                >
                  Descrição
                </Label>
                <Textarea
                  id="edit-description"
                  placeholder="Detalhes do produto, características, material..."
                  value={formData.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  className="min-h-[100px] resize-none"
                />
              </div>
            </div>
          </div>

          {/* Estoque */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-sm">
                <Boxes className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground">
                  Estoque
                </h3>
                <p className="text-xs text-muted-foreground">
                  Quantidade disponível e variação
                </p>
              </div>
            </div>
            <Separator />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-quantity" className="text-sm font-medium">
                  Quantidade em estoque
                </Label>
                <Input
                  id="edit-quantity"
                  type="number"
                  min="0"
                  placeholder="0"
                  value={formData.quantity}
                  onChange={(e) =>
                    handleChange("quantity", parseInt(e.target.value) || 0)
                  }
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="edit-size"
                  className="text-sm font-medium flex items-center gap-1.5"
                >
                  <Ruler className="w-3.5 h-3.5 text-muted-foreground" />
                  Tamanho
                </Label>
                <Input
                  id="edit-size"
                  placeholder="P, M, G, GG, 42, Único..."
                  value={formData.size}
                  onChange={(e) => handleChange("size", e.target.value)}
                  className="h-11"
                />
              </div>
            </div>
          </div>

          {/* Precificação */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-sm">
                <DollarSign className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground">
                  Precificação
                </h3>
                <p className="text-xs text-muted-foreground">
                  Custo, venda e margem de lucro
                </p>
              </div>
            </div>
            <Separator />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-cost" className="text-sm font-medium">
                  Preço de custo
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                    R$
                  </span>
                  <Input
                    id="edit-cost"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0,00"
                    value={formData.cost_price}
                    onChange={(e) =>
                      handleChange(
                        "cost_price",
                        parseFloat(e.target.value) || 0,
                      )
                    }
                    className="h-11 pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-sale" className="text-sm font-medium">
                  Preço de venda <span className="text-rose-500">*</span>
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                    R$
                  </span>
                  <Input
                    id="edit-sale"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0,00"
                    value={formData.sale_price}
                    onChange={(e) =>
                      handleChange(
                        "sale_price",
                        parseFloat(e.target.value) || 0,
                      )
                    }
                    className="h-11 pl-10"
                  />
                </div>
              </div>
            </div>

            {/* Margem */}
            <div
              className={`relative overflow-hidden rounded-xl bg-gradient-to-r ${margemTone} p-5 text-white shadow-sm`}
            >
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_right,white,transparent_60%)]" />
              <div className="relative flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-lg bg-white/20 backdrop-blur flex items-center justify-center">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wider text-white/80 font-medium">
                      Margem de lucro
                    </p>
                    <p className="text-2xl font-bold">
                      R$ {margemValor.toFixed(2).replace(".", ",")}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur font-semibold">
                  <Percent className="w-4 h-4" />
                  {margemPercent.toFixed(1)}%
                </div>
              </div>
            </div>
          </div>

          {/* Resumo rápido */}
          <div className="rounded-xl border border-border/60 bg-muted/30 p-4 space-y-3">
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-semibold text-foreground">
                Resumo rápido
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm text-muted-foreground">Produto:</span>
              <span className="text-sm font-semibold text-foreground">
                {formData.name || "—"}
              </span>
              {categoriaLabel && (
                <Badge
                  variant="outline"
                  className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400"
                >
                  {categoriaLabel}
                </Badge>
              )}
              {formData.size && (
                <Badge variant="outline" className="bg-muted/60">
                  Tam: {formData.size}
                </Badge>
              )}
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-lg border border-border/60 bg-background p-3">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">
                  Estoque
                </p>
                <p className="text-lg font-bold text-foreground mt-1">
                  {formData.quantity}
                </p>
              </div>
              <div className="rounded-lg border border-border/60 bg-background p-3">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">
                  Custo
                </p>
                <p className="text-lg font-bold text-foreground mt-1">
                  R$ {(formData.cost_price || 0).toFixed(2).replace(".", ",")}
                </p>
              </div>
              <div className="rounded-lg border border-border/60 bg-background p-3">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">
                  Venda
                </p>
                <p className="text-lg font-bold text-foreground mt-1">
                  R$ {(formData.sale_price || 0).toFixed(2).replace(".", ",")}
                </p>
              </div>
            </div>
          </div>

          <DialogFooter className="pt-2 bg-transparent flex justify-end items-center">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="h-11 cursor-pointer"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-sm cursor-pointer"
              onClick={() => handleUpdateProduct()}
            >
              <Save className="w-4 h-4 mr-2" />
              Salvar alterações
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
