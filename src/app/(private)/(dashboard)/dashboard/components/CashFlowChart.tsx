"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GetCashFlowResponse } from "@/interfaces/cash-flow.interface";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

interface Props {
  cashFlow: GetCashFlowResponse[];
}

export function CashFlowChart({ cashFlow }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Fluxo de Caixa (7 messes)</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={cashFlow}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="total_inflow"
              stroke="hsl(var(--secondary))"
              strokeWidth={2}
              name="Entradas"
            />
            <Line
              type="monotone"
              dataKey="total_outflow"
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
