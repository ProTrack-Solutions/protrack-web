import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Eraser, Save, Tag } from "lucide-react";

import { useProductsCategories } from "@/hooks/useProductsCategories";
import { CreateProductParams } from "@/interfaces/product-registration.interface";

interface CadastroProdutoResumoProps {
  formData: CreateProductParams;
  loading: boolean;
  onReset: () => void;
  handleCreateProduct: () => void;
}

export function CadastroProdutoResumo({
  formData,
  onReset,
  handleCreateProduct,
  loading,
}: CadastroProdutoResumoProps) {
  const precoVenda = Number(formData.sale_price || 0)
    .toFixed(2)
    .replace(".", ",");

  const { productsCategories } = useProductsCategories();

  return (
    <Card className="border-border/50 sticky top-6">
      <CardContent className="p-6 space-y-5">
        <div className="flex items-center gap-3 pb-2 border-b border-border/50">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border border-blue-500/20 flex items-center justify-center">
            <Tag className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-foreground">Resumo</h2>
            <p className="text-xs text-muted-foreground">Pré-visualização</p>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
              Produto
            </p>
            <p className="text-sm font-semibold text-foreground mt-1 break-words">
              {formData.name || "—"}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {formData.category_id && (
              <Badge
                variant="outline"
                className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400"
              >
                {productsCategories?.map(
                  (productsCategory) =>
                    productsCategory.id === formData.category_id &&
                    productsCategory.name,
                )}
              </Badge>
            )}
            {formData.size && (
              <Badge variant="outline" className="bg-muted/60">
                Tam: {formData.size}
              </Badge>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="rounded-lg border border-border/60 bg-muted/30 p-3">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">
                Estoque
              </p>
              <p className="text-lg font-bold text-foreground mt-1">
                {formData.quantity || 0}
              </p>
            </div>
            <div className="rounded-lg border border-border/60 bg-muted/30 p-3">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">
                Venda
              </p>
              <p className="text-lg font-bold text-foreground mt-1">
                R$ {precoVenda}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-2 pt-2 border-t border-border/50">
          <Button
            type="submit"
            className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-sm cursor-pointer"
            onClick={() => handleCreateProduct()}
          >
            <Save className="w-4 h-4 mr-2" />
            {loading ? "Cadastrando ..." : "Cadastrar produto"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onReset}
            className="w-full h-11"
          >
            <Eraser className="w-4 h-4 mr-2" />
            Limpar formulário
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
