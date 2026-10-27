"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { brl, brlCompact } from "@/components/DashCard";

export interface CashFlowPoint {
  label: string;
  inflow: number;
  outflow: number;
}

interface TooltipPayload {
  active?: boolean;
  label?: string;
  payload?: { payload: CashFlowPoint }[];
}

function ChartTooltip({ active, payload, label }: TooltipPayload) {
  if (!active || !payload?.length) return null;
  const { inflow, outflow } = payload[0].payload;
  const net = inflow - outflow;
  return (
    <div className="rounded-xl border border-border bg-card px-3 py-2 text-xs shadow-lg">
      <p className="mb-1 font-semibold capitalize text-foreground">{label}</p>
      <p className="text-[hsl(150_45%_35%)]">Entradas: {brl(inflow)}</p>
      <p className="text-destructive">Saídas: {brl(outflow)}</p>
      <p
        className={`mt-1 border-t border-border pt-1 font-semibold ${
          net < 0 ? "text-destructive" : "text-foreground"
        }`}
      >
        Resultado: {brl(net)}
      </p>
    </div>
  );
}

// Arquivo separado de propósito: o recharts só é baixado quando este
// componente é carregado (via next/dynamic no CashFlowCard).
export default function CashFlowChart({ data }: { data: CashFlowPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="cf-in" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="0%"
              stopColor="hsl(var(--secondary))"
              stopOpacity={0.35}
            />
            <stop
              offset="100%"
              stopColor="hsl(var(--secondary))"
              stopOpacity={0}
            />
          </linearGradient>
          <linearGradient id="cf-out" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="0%"
              stopColor="hsl(var(--destructive))"
              stopOpacity={0.25}
            />
            <stop
              offset="100%"
              stopColor="hsl(var(--destructive))"
              stopOpacity={0}
            />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} stroke="hsl(var(--border))" />
        <XAxis
          dataKey="label"
          tickLine={false}
          axisLine={false}
          tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
        />
        <YAxis
          width={72}
          tickLine={false}
          axisLine={false}
          tickFormatter={brlCompact}
          tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
        />
        <Tooltip
          content={<ChartTooltip />}
          cursor={{ stroke: "hsl(var(--border))", strokeWidth: 1 }}
        />
        <Area
          type="monotone"
          dataKey="inflow"
          name="Entradas"
          stroke="hsl(var(--secondary))"
          strokeWidth={2.5}
          fill="url(#cf-in)"
          animationDuration={900}
        />
        <Area
          type="monotone"
          dataKey="outflow"
          name="Saídas"
          stroke="hsl(var(--destructive))"
          strokeWidth={2.5}
          fill="url(#cf-out)"
          animationDuration={900}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
