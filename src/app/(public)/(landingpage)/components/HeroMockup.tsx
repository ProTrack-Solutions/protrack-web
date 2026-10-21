import {
  Boxes,
  DollarSign,
  LayoutDashboard,
  ShoppingCart,
  Users,
} from "lucide-react";
import { Counter } from "./Counter";

const bars = [38, 52, 44, 68, 57, 74, 63, 82, 70, 91, 78, 96];

const recentSales = [
  { name: "Maria Souza", value: "R$ 389,90", status: "Pago", tone: "chip-green" },
  { name: "Loja Bela Vista", value: "R$ 1.240,00", status: "3/6", tone: "chip-blue" },
  { name: "João Pereira", value: "R$ 159,00", status: "Pago", tone: "chip-green" },
  { name: "Ana Lima", value: "R$ 612,50", status: "Pendente", tone: "chip-peach" },
];

const kpis = [
  { label: "Receita do mês", value: <Counter to={48290} prefix="R$ " duration={2200} />, delta: "+18%" },
  { label: "Vendas hoje", value: <Counter to={37} duration={1800} />, delta: "+6" },
  { label: "Ticket médio", value: <Counter to={186} prefix="R$ " duration={2000} />, delta: "+4%" },
];

/** Janela "falsa" do sistema exibida no hero — 100% HTML/CSS, sem imagem */
export function HeroMockup() {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/15 bg-card text-card-foreground shadow-[0_40px_120px_-30px_hsl(211_79%_50%/0.55)] sm:rounded-3xl">
      {/* barra da janela */}
      <div className="flex items-center gap-2 border-b border-border bg-secondary/70 px-4 py-3">
        <span className="h-3 w-3 rounded-full bg-[hsl(0_80%_68%)]" />
        <span className="h-3 w-3 rounded-full bg-[hsl(42_90%_62%)]" />
        <span className="h-3 w-3 rounded-full bg-[hsl(140_55%_55%)]" />
        <span className="mx-auto rounded-full bg-card px-4 py-1 text-[11px] font-medium text-muted-foreground shadow-sm">
          ProTrack Gerencial • Dashboard
        </span>
      </div>

      <div className="flex text-left">
        {/* sidebar */}
        <aside className="hidden w-16 shrink-0 flex-col items-center gap-3 border-r border-border bg-secondary/40 py-5 sm:flex">
          {[LayoutDashboard, Boxes, ShoppingCart, DollarSign, Users].map(
            (Icon, i) => (
              <span
                key={i}
                className={`grid h-10 w-10 place-items-center rounded-xl transition-colors ${
                  i === 0
                    ? "bg-gradient-primary text-white shadow-md"
                    : "text-muted-foreground"
                }`}
              >
                <Icon className="h-5 w-5" />
              </span>
            ),
          )}
        </aside>

        <div className="min-w-0 flex-1 p-4 sm:p-6">
          {/* KPIs */}
          <div className="grid grid-cols-3 gap-2 sm:gap-4">
            {kpis.map((k) => (
              <div
                key={k.label}
                className="rounded-xl border border-border bg-background p-2.5 sm:p-4"
              >
                <p className="truncate text-[10px] font-medium uppercase tracking-wider text-muted-foreground sm:text-xs">
                  {k.label}
                </p>
                <p className="mt-1 truncate text-sm font-extrabold sm:text-2xl">
                  {k.value}
                </p>
                <p className="mt-0.5 text-[10px] font-bold text-[hsl(155_55%_38%)] sm:text-xs">
                  {k.delta}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-[1.4fr_1fr]">
            {/* gráfico */}
            <div className="rounded-xl border border-border bg-background p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-bold">Faturamento</p>
                <span className="rounded-full bg-secondary px-2.5 py-0.5 text-[10px] font-semibold text-muted-foreground">
                  12 meses
                </span>
              </div>
              <div className="mt-4 flex h-28 items-end gap-1.5 sm:h-36">
                {bars.map((h, i) => (
                  <span
                    key={i}
                    className="bar-grow flex-1 rounded-t-md bg-linear-to-t from-[hsl(211_79%_60%)] to-[hsl(155_55%_52%)]"
                    style={{
                      height: `${h}%`,
                      animationDelay: `${900 + i * 70}ms`,
                      opacity: 0.55 + (i / bars.length) * 0.45,
                    }}
                  />
                ))}
              </div>
            </div>

            {/* últimas vendas */}
            <div className="hidden rounded-xl border border-border bg-background p-4 md:block">
              <p className="text-sm font-bold">Últimas vendas</p>
              <ul className="mt-3 space-y-2.5">
                {recentSales.map((s, i) => (
                  <li
                    key={s.name}
                    className="animate-slide-in-row flex items-center gap-2.5"
                    style={{ animationDelay: `${1300 + i * 160}ms` }}
                  >
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-secondary text-xs font-bold text-muted-foreground">
                      {s.name[0]}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-xs font-semibold">
                        {s.name}
                      </span>
                      <span className="block text-[11px] text-muted-foreground">
                        {s.value}
                      </span>
                    </span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${s.tone}`}
                    >
                      {s.status}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
