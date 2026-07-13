import { useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { VendaForm } from "@/schemas/sale.schema";

export function SaleFormActions() {
  const { formState } = useFormContext<VendaForm>();

  return (
    <div className="flex justify-end space-x-4">
      <Button
        type="button"
        variant="outline"
        onClick={() => console.log(formState)}
      >
        Cancelar
      </Button>
      <Button type="submit">Cadastrar Venda</Button>
    </div>
  );
}
