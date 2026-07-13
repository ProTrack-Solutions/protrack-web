"use client";

import { getPaymentMethodColor } from "@/app/utils/paymentMethodFormat";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GetPaymentMethodsStatsResponse } from "@/interfaces/payment-methods.interface";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";

interface Props {
  paymentMethodsStats: GetPaymentMethodsStatsResponse[];
}

export function PaymentMethodsChart({ paymentMethodsStats }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Formas de Pagamento</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={paymentMethodsStats}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              cornerRadius={6}
              dataKey="percentage_method"
              nameKey="payment_method"
            >
              {paymentMethodsStats.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={getPaymentMethodColor(entry.payment_method)}
                />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
        <div className="flex flex-wrap justify-center gap-4 mt-4">
          {paymentMethodsStats.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{
                  backgroundColor: getPaymentMethodColor(item.payment_method),
                }}
              />
              <span className="text-sm text-muted-foreground">
                {item.payment_method}: {item.percentage_method}%
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
