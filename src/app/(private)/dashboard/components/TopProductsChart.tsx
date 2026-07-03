"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GetTop5ProductsResponse } from "@/interfaces/sale.interface";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

interface Props {
  topProducts: GetTop5ProductsResponse[];
}

export function TopProductsChart({ topProducts }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Produtos</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={topProducts}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis dataKey="product_name" />
            <YAxis />
            <Tooltip />
            <Bar
              dataKey="total_sale"
              fill="hsl(var(--primary))"
              name="Vendas"
            />
            <Bar
              dataKey="product_real_profit"
              fill="hsl(var(--secondary))"
              name="Lucro"
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
