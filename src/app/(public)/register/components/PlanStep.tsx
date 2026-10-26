import { Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { PlanIcon } from "@/components/PlanIcon";
import { usePlans } from "@/hooks/usePlans";
import { PlansResponse } from "@/interfaces/plans.interface";
import { getDiscountPercent, getOriginalPriceCents } from "@/utils/planPricing";

interface PlanStepProps {
  selectedPlan: PlansResponse;
  setSelectedPlan: (plan: PlansResponse) => void;
}

export default function PlanStep({
  selectedPlan,
  setSelectedPlan,
}: PlanStepProps) {
  const { plans } = usePlans();
  return (
    <div className="space-y-3">
      {Array.isArray(plans) &&
        plans?.map((p) => {
          const isSelected = selectedPlan === p;
          const originalPriceCents = getOriginalPriceCents(p);
          const discountPercent = getDiscountPercent(p);
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => setSelectedPlan(p)}
              aria-pressed={isSelected}
              className={`relative w-full cursor-pointer rounded-2xl border-2 p-5 text-left transition-all duration-300 hover:-translate-y-0.5 ${
                isSelected
                  ? "border-[hsl(var(--primary))] bg-[hsl(var(--primary)/0.06)] shadow-[0_16px_40px_-20px_hsl(211_79%_50%/0.7)]"
                  : "border-border bg-card hover:border-[hsl(var(--primary)/0.5)]"
              }`}
            >
              {p.highlight && (
                <Badge className="bg-gradient-primary absolute -top-2.5 right-4 rounded-full border-0 px-3 font-bold text-white">
                  Mais popular
                </Badge>
              )}
              <div className="flex items-start gap-4">
                <div
                  className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl transition-colors ${
                    isSelected
                      ? "bg-[hsl(var(--night))] text-white"
                      : "chip-blue"
                  }`}
                >
                  <PlanIcon name={p.icon} className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline justify-between gap-2">
                    <h3 className="font-display text-lg font-extrabold">
                      {p.name}
                    </h3>
                    <div className="text-right shrink-0">
                      {originalPriceCents && (
                        <div className="flex items-center justify-end gap-1.5">
                          <span className="text-xs text-muted-foreground line-through">
                            R${originalPriceCents / 100}
                          </span>
                          <span className="chip-green rounded-full px-1.5 text-xs font-bold">
                            -{discountPercent}%
                          </span>
                        </div>
                      )}
                      <span className="font-display text-2xl font-extrabold">
                        R${p.price_cents / 100}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        /mês
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">
                    {p.description}
                  </p>
                  {p.trial_days > 0 && (
                    <p className="chip-green mb-2 inline-block rounded-full px-2 py-0.5 text-xs font-semibold">
                      {p.trial_days} dias grátis para testar
                    </p>
                  )}
                  <div className="flex flex-wrap gap-x-3 gap-y-1">
                    {p.features?.map((f) => (
                      <span
                        key={f.id}
                        className="text-xs text-muted-foreground flex items-center gap-1"
                      >
                        <Check className="h-3 w-3 text-[hsl(155_55%_40%)]" />{" "}
                        {f.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </button>
          );
        })}
    </div>
  );
}
