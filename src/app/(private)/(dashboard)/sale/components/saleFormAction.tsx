import { useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { CreateSaleParams } from "@/interfaces/sale.interface";

export function SaleFormActions() {
  const { formState, reset } = useFormContext<CreateSaleParams>();

  return (
    <div className="flex justify-end space-x-4">
      <Button
        type="button"
        variant="outline"
        disabled={formState.isSubmitting}
        onClick={() => reset()}
      >
        Cancelar
      </Button>
      {/* Desabilita durante o envio para não cadastrar a mesma venda duas vezes */}
      <Button type="submit" disabled={formState.isSubmitting}>
        {formState.isSubmitting ? "Cadastrando..." : "Cadastrar Venda"}
      </Button>
    </div>
  );
}
