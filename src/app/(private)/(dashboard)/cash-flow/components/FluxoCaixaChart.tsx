import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { FluxoCaixaDia } from "../page";

interface FluxoCaixaChartProps {
  dados: FluxoCaixaDia[];
}

export function FluxoCaixaChart({ dados }: FluxoCaixaChartProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Fluxo de Caixa Histórico e Projeções</CardTitle>
          <div className="flex gap-2">
            <Badge variant="secondary">Histórico</Badge>
            <Badge variant="outline">Projeção</Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <ComposedChart data={dados}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis dataKey="data" />
            <YAxis />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="saldo"
              fill="hsl(var(--primary) / 0.1)"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              name="Saldo Acumulado"
            />
            <Bar
              dataKey="entradas"
              fill="hsl(var(--secondary))"
              name="Entradas"
            />
            <Bar
              dataKey="saidas"
              fill="hsl(var(--destructive))"
              name="Saídas"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
