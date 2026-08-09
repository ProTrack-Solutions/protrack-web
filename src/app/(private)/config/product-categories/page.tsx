"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Package, Plus, Edit, Trash2, Check, X } from "lucide-react";
import { toast } from "sonner";
import { useProductsCategories } from "@/hooks/useProductsCategories";
import { CreateProductCategory } from "@/service/products-categories.service";
import { HeaderConfig } from "@/components/HeaderConfig";

export default function ProductCategoriesConfigPage() {
  // Estados para categorias de produto
  const { productsCategories, refetch } = useProductsCategories();
  const [novaCatProduto, setNovaCatProduto] = useState({
    name: "",
    color: "#3b82f6",
  });
  console.log("novaCatProduto", novaCatProduto);
  const [editandoCatProduto, setEditandoCatProduto] = useState<string | null>(
    null,
  );
  const [editCatProdutoData, setEditCatProdutoData] = useState({
    name: "",
    color: "",
  });

  const handleAdicionarCatProduto = async () => {
    try {
      if (!novaCatProduto.name.trim()) {
        toast("Informe o nome da categoria.");
        return;
      }

      await CreateProductCategory({
        color: novaCatProduto.color,
        name: novaCatProduto.name,
      });

      toast.success("Categoria criada com sucesso!");
    } catch (error) {
      console.log(error);
      toast.error("Eroo ao cadastrar a categoria");
    } finally {
      refetch();
      setNovaCatProduto({
        color: "#3b82f6",
        name: "",
      });
    }
  };

  return (
    <div className="space-y-6">
      <HeaderConfig
        title="Categorias de Produto"
        description="Cadastre e gerencie as categorias dos seus produtos"
      />

      {/* Adicionar nova categoria */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Nova Categoria
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 items-end">
            <div className="flex-1 space-y-2">
              <Label>Nome</Label>
              <Input
                placeholder="Ex: Roupas, Calçados, Acessórios"
                value={novaCatProduto.name}
                onChange={(e) =>
                  setNovaCatProduto((prev) => ({
                    ...prev,
                    name: e.target.value,
                  }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Cor</Label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={novaCatProduto.color}
                  onChange={(e) =>
                    setNovaCatProduto((prev) => ({
                      ...prev,
                      color: e.target.value,
                    }))
                  }
                  className="w-10 h-10 rounded-md border border-border cursor-pointer"
                />
              </div>
            </div>
            <Button
              onClick={handleAdicionarCatProduto}
              className="cursor-pointer"
            >
              <Plus className="h-4 w-4 mr-2" />
              Adicionar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Lista de categorias */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Categorias Cadastradas ({productsCategories?.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {productsCategories?.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              Nenhuma categoria cadastrada. Adicione a primeira acima.
            </p>
          ) : (
            <div className="space-y-3">
              {productsCategories?.map((cat) => (
                <div
                  key={cat.id}
                  className="flex items-center justify-between p-4 rounded-lg border"
                >
                  {editandoCatProduto === cat.id ? (
                    <div className="flex items-center gap-3 flex-1 mr-4">
                      <input
                        type="color"
                        value={editCatProdutoData.color}
                        onChange={(e) =>
                          setEditCatProdutoData((prev) => ({
                            ...prev,
                            color: e.target.value,
                          }))
                        }
                        className="w-8 h-8 rounded-md border border-border cursor-pointer"
                      />
                      <Input
                        value={editCatProdutoData.name}
                        onChange={(e) =>
                          setEditCatProdutoData((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }))
                        }
                        className="flex-1"
                      />
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <div
                        className="w-5 h-5 rounded-full border border-border"
                        style={{ backgroundColor: cat.color }}
                      />
                      <span className="font-medium text-foreground">
                        {cat.name}
                      </span>
                      <Badge
                        variant="secondary"
                        style={{
                          backgroundColor: cat.color + "20",
                          color: cat.color,
                          borderColor: cat.color,
                        }}
                      >
                        {cat.name}
                      </Badge>
                    </div>
                  )}
                  <div className="flex gap-2">
                    {editandoCatProduto === cat.id ? (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setEditandoCatProduto("");
                          }}
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <X className="h-4 w-4" />
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setEditandoCatProduto(cat.id);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
