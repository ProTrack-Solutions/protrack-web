import Link from "next/link";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "./Reveal";
import { usePlans } from "@/hooks/usePlans";
import { getDiscountPercent, getOriginalPriceCents } from "@/utils/planPricing";

const QUANTITY_FEATURE_KEYS = [
  "max_users",
  "max_products",
  "max_sales_month",
  "whatsapp_integration",
  "nfe_emition",
];

export function PricingSection() {
  const { plans } = usePlans();

  return (
    <section
      id="planos"
      className="border-y border-border bg-secondary/40 py-24 sm:py-32"
    >
      <div className="mx-auto max-w-7xl px-5">
        <Reveal className="mb-14 text-center">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-primary">
            Planos
          </p>
          <h2 className="text-[clamp(2rem,5vw,3.75rem)] font-black uppercase leading-[0.95] tracking-tight text-foreground">
            Escolha o seu tamanho
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-lg text-muted-foreground">
            Todos os planos incluem atualizações, acesso em nuvem e seus dados
            sempre seus.
          </p>
        </Reveal>

        <div className="grid gap-5 lg:grid-cols-3">
          {plans?.map((p, i) => {
            const originalPriceCents = getOriginalPriceCents(p);
            const discountPercent = getDiscountPercent(p);

            return (
              <Reveal key={p.name} delay={i * 120}>
                <div
                  className={`relative flex h-full flex-col rounded-2xl border p-8 transition-all duration-500 hover:-translate-y-1.5 ${
                    p.highlight
                      ? "border-primary/50 bg-card shadow-lg"
                      : "border-border bg-card/80 shadow-sm"
                  }`}
                >
                  {p.highlight && (
                    <Badge className="absolute -top-3 left-8 bg-gradient-primary text-primary-foreground">
                      Mais escolhido
                    </Badge>
                  )}
                  <h3 className="text-sm font-bold uppercase tracking-[0.25em] text-primary">
                    {p.name}
                  </h3>
                  {originalPriceCents && (
                    <div className="mt-4 flex items-center gap-2">
                      <span className="text-sm text-muted-foreground line-through">
                        R$ {originalPriceCents / 100}
                      </span>
                      <Badge className="bg-emerald-600 text-white hover:bg-emerald-600">
                        {discountPercent}% OFF
                      </Badge>
                    </div>
                  )}
                  <div
                    className={`${originalPriceCents ? "mt-1" : "mt-4"} flex items-end gap-1.5`}
                  >
                    <span className="text-sm text-muted-foreground">R$</span>
                    <span className="text-5xl font-black leading-none text-card-foreground">
                      {p.price_cents / 100}
                    </span>
                    <span className="pb-1 text-sm text-muted-foreground">
                      /mês
                    </span>
                  </div>
                  {p.trial_days > 0 && (
                    <p className="mt-2 text-sm font-semibold text-emerald-600">
                      {p.trial_days} dias grátis para testar
                    </p>
                  )}
                  <p className="mt-3 text-sm text-muted-foreground">
                    {p.description}
                  </p>
                  <ul className="mt-7 flex-1 space-y-3">
                    {p.features.map((f) => (
                      <li
                        key={f.id}
                        className="flex items-start gap-2.5 text-sm text-card-foreground"
                      >
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-[hsl(155,55%,42%)]" />
                        {f.name}
                        {QUANTITY_FEATURE_KEYS.includes(f.feature_key) &&
                          ` - ${f.limit_value > 0 ? f.limit_value : "Ilimitado"}`}
                      </li>
                    ))}
                  </ul>
                  <Button
                    asChild
                    className={`mt-8 h-12 w-full font-bold uppercase tracking-wide ${
                      p.highlight
                        ? "bg-gradient-primary text-primary-foreground hover:opacity-90"
                        : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                    }`}
                  >
                    <Link href="/register">
                      {p.trial_days > 0
                        ? `Testar grátis por ${p.trial_days} dias`
                        : `Assinar ${p.name}`}
                    </Link>
                  </Button>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
