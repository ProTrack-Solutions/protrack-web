import { ShoppingCart } from "lucide-react";

export function SaleHeader() {
  return (
    <div className="flex items-center gap-3">
      <ShoppingCart className="h-8 w-8 text-primary" />
      <h1 className="text-3xl font-bold">Cadastro de Vendas</h1>
    </div>
  );
}
