"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

interface CashFlowProps {
  data: Array<{ data: string; entrada: number; saida: number }>;
}

export function CashFlowChart({ data }: CashFlowProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Fluxo de Caixa (7 dias)</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis dataKey="data" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="entrada"
              stroke="hsl(var(--secondary))"
              strokeWidth={2}
              name="Entradas"
            />
            <Line
              type="monotone"
              dataKey="saida"
              stroke="hsl(var(--destructive))"
              strokeWidth={2}
              name="Saídas"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
