import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tag, Plus, Edit, Trash2 } from "lucide-react";
import { ListBillsCategoriesResponse } from "@/interfaces/bills-categories.interface";
import { DeleteBillCategory } from "@/service/bills-categories.service";
import { toast } from "sonner";

interface CategoriesCardProps {
  categories: ListBillsCategoriesResponse[];
  onAdd: () => void;
}

export function CategoriesCard({ categories, onAdd }: CategoriesCardProps) {
  const handleDeleteCategory = async (billId: string) => {
    try {
      await DeleteBillCategory(billId);
      toast.success("Categoria excluida com sucesso!");
    } catch (error) {
      console.log(error);
      toast.error("Erro ao excluir a categoria!");
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <Tag className="h-5 w-5" />
            Categorias de Despesas
          </CardTitle>
          <Button onClick={onAdd}>
            <Plus className="h-4 w-4 mr-2" /> Nova Categoria
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {categories.map((category) => (
            <div
              key={category.id}
              className="flex items-center justify-between p-3 rounded-lg border"
            >
              <div className="flex items-center gap-3">
                <span className="font-medium">{category.name}</span>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="cursor-pointer"
                  onClick={() => handleDeleteCategory(category.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
