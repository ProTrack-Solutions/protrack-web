import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Periodo, TipoVisualizacao } from "../page";

interface FluxoCaixaHeaderProps {
  periodo: Periodo;
  onPeriodoChange: (value: Periodo) => void;
  tipoVisualizacao: TipoVisualizacao;
  onTipoVisualizacaoChange: (value: TipoVisualizacao) => void;
}

export function FluxoCaixaHeader({
  periodo,
  onPeriodoChange,
  tipoVisualizacao,
  onTipoVisualizacaoChange,
}: FluxoCaixaHeaderProps) {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Fluxo de Caixa
        </h1>
        <p className="text-muted-foreground">
          Visualize entradas, saídas e projeções financeiras
        </p>
      </div>
      <div className="flex gap-3">
        <Select
          value={periodo}
          onValueChange={(value) => onPeriodoChange(value as Periodo)}
        >
          <SelectTrigger className="w-35">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7">7 {tipoVisualizacao}</SelectItem>
            <SelectItem value="15">15 {tipoVisualizacao}</SelectItem>
            <SelectItem value="30">30 {tipoVisualizacao}</SelectItem>
            <SelectItem value="90">90 {tipoVisualizacao}</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={tipoVisualizacao}
          onValueChange={(value) =>
            onTipoVisualizacaoChange(value as TipoVisualizacao)
          }
        >
          <SelectTrigger className="w-35">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="diario">Diário</SelectItem>
            <SelectItem value="semanal">Semanal</SelectItem>
            <SelectItem value="mensal">Mensal</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
