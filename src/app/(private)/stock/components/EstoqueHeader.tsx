import { Button } from "@/components/ui/button";
import { Package, Plus } from "lucide-react";

export function EstoqueHeader() {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 p-8 shadow-lg">
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_right,white,transparent_60%)]" />
      <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur text-white text-xs font-medium">
            <Package className="w-3.5 h-3.5" />
            Gestão de Estoque
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
            Seus produtos, sob controle
          </h1>
          <p className="text-blue-100 max-w-xl">
            Visualize, pesquise e gerencie todo o seu inventário em um único
            lugar.
          </p>
        </div>
        <Button
          size="lg"
          className="bg-white text-blue-700 hover:bg-blue-50 shadow-md font-semibold"
        >
          <Plus className="w-4 h-4 mr-2" />
          Novo Produto
        </Button>
      </div>
    </div>
  );
}
