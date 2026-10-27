"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Line,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  CashFlowForecastPoint,
  CashFlowPeriod,
  CashFlowPoint,
} from "@/interfaces/cash-flow.interface";
import { brl, brlCompact } from "@/components/DashCard";
import { POSITIVE_TEXT, bucketLabel, bucketTitle } from "./format";

// Arquivo separado de propósito: o recharts só é baixado quando os gráficos
// são carregados (via next/dynamic), e os dois gráficos dividem o mesmo chunk.

const axisTick = { fontSize: 12, fill: "hsl(var(--muted-foreground))" };

function TooltipBox({
  title,
  rows,
  footer,
}: {
  title: string;
  rows: { label: string; value: number; className: string }[];
  footer?: { label: string; value: number };
}) {
  return (
    <div className="rounded-xl border border-border bg-card px-3 py-2 text-xs shadow-lg">
      <p className="mb-1 font-semibold capitalize text-foreground">{title}</p>
      {rows.map((r) => (
        <p key={r.label} className={r.className}>
          {r.label}: {brl(r.value)}
        </p>
      ))}
      {footer && (
        <p
          className={`mt-1 border-t border-border pt-1 font-semibold ${
            footer.value < 0 ? "text-destructive" : "text-foreground"
          }`}
        >
          {footer.label}: {brl(footer.value)}
        </p>
      )}
    </div>
  );
}

interface TooltipProps<T> {
  active?: boolean;
  payload?: { payload: T }[];
}

function MainTooltip({
  active,
  payload,
  period,
}: TooltipProps<CashFlowPoint> & { period: CashFlowPeriod }) {
  if (!active || !payload?.length) return null;
  const p = payload[0].payload;
  return (
    <TooltipBox
      title={bucketTitle(p.date, period)}
      rows={[
        { label: "Entradas", value: p.inflow, className: POSITIVE_TEXT },
        { label: "Saídas", value: p.outflow, className: "text-destructive" },
        {
          label: "Resultado",
          value: p.net,
          className: p.net < 0 ? "text-destructive" : "text-foreground",
        },
      ]}
      footer={{ label: "Acumulado", value: p.balance }}
    />
  );
}

function ForecastTooltip({
  active,
  payload,
}: TooltipProps<CashFlowForecastPoint>) {
  if (!active || !payload?.length) return null;
  const p = payload[0].payload;
  return (
    <TooltipBox
      title={bucketTitle(p.date, "day")}
      rows={[
        { label: "A receber", value: p.receivable, className: POSITIVE_TEXT },
        { label: "A pagar", value: p.payable, className: "text-destructive" },
      ]}
      footer={{ label: "Saldo previsto", value: p.balance }}
    />
  );
}

export type MainChartView = "flow" | "net";

export function MainChart({
  points,
  period,
  view,
}: {
  points: CashFlowPoint[];
  period: CashFlowPeriod;
  view: MainChartView;
}) {
  const data = points.map((p) => ({
    ...p,
    label: bucketLabel(p.date, period),
  }));
  // Muitas barras: deixa o recharts pular rótulos para não encavalar
  const interval = data.length > 16 ? "preserveStartEnd" : 0;

  const common = {
    data,
    margin: { top: 8, right: 8, left: 0, bottom: 0 },
  };

  const axes = (
    <>
      <CartesianGrid vertical={false} stroke="hsl(var(--border))" />
      <XAxis
        dataKey="label"
        tickLine={false}
        axisLine={false}
        interval={interval}
        minTickGap={12}
        tick={axisTick}
      />
      <YAxis
        width={72}
        tickLine={false}
        axisLine={false}
        tickFormatter={brlCompact}
        tick={axisTick}
      />
      <Tooltip
        content={<MainTooltip period={period} />}
        cursor={{ fill: "hsl(var(--muted) / 0.5)" }}
      />
    </>
  );

  return (
    <ResponsiveContainer width="100%" height={320}>
      {view === "net" ? (
        <BarChart {...common}>
          {axes}
          <ReferenceLine y={0} stroke="hsl(var(--border))" />
          <Bar
            dataKey="net"
            name="Resultado"
            radius={[4, 4, 4, 4]}
            maxBarSize={36}
          >
            {data.map((p) => (
              <Cell
                key={p.date}
                fill={
                  p.net < 0
                    ? "hsl(var(--destructive))"
                    : "hsl(var(--secondary))"
                }
              />
            ))}
          </Bar>
        </BarChart>
      ) : (
        <ComposedChart {...common}>
          {axes}
          <Bar
            dataKey="inflow"
            name="Entradas"
            fill="hsl(var(--secondary))"
            radius={[4, 4, 0, 0]}
            maxBarSize={28}
          />
          <Bar
            dataKey="outflow"
            name="Saídas"
            fill="hsl(var(--destructive))"
            radius={[4, 4, 0, 0]}
            maxBarSize={28}
          />
          <Line
            type="monotone"
            dataKey="balance"
            name="Acumulado"
            stroke="hsl(var(--primary))"
            strokeWidth={2.5}
            dot={false}
            activeDot={{ r: 4 }}
          />
        </ComposedChart>
      )}
    </ResponsiveContainer>
  );
}

export function ForecastChart({ points }: { points: CashFlowForecastPoint[] }) {
  const data = points.map((p) => ({ ...p, label: bucketLabel(p.date, "day") }));

  return (
    <ResponsiveContainer width="100%" height={180}>
      <ComposedChart
        data={data}
        margin={{ top: 8, right: 4, left: 0, bottom: 0 }}
      >
        <CartesianGrid vertical={false} stroke="hsl(var(--border))" />
        <XAxis
          dataKey="label"
          tickLine={false}
          axisLine={false}
          interval="preserveStartEnd"
          minTickGap={16}
          tick={axisTick}
        />
        <YAxis hide />
        <ReferenceLine y={0} stroke="hsl(var(--border))" />
        <Tooltip
          content={<ForecastTooltip />}
          cursor={{ fill: "hsl(var(--muted) / 0.5)" }}
        />
        <Bar
          dataKey="receivable"
          fill="hsl(var(--secondary))"
          radius={[3, 3, 0, 0]}
          maxBarSize={10}
        />
        <Bar
          dataKey="payable"
          fill="hsl(var(--destructive))"
          radius={[3, 3, 0, 0]}
          maxBarSize={10}
        />
        <Line
          type="stepAfter"
          dataKey="balance"
          stroke="hsl(var(--primary))"
          strokeWidth={2}
          dot={false}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
