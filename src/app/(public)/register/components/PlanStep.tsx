import { Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { usePlans } from "@/hooks/usePlans";
import { PlansResponse } from "@/interfaces/plans.interface";

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
          // const Icon = p.name;
          const isSelected = selectedPlan === p;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => setSelectedPlan(p)}
              className={`w-full text-left rounded-xl border-2 p-4 transition-all relative ${
                isSelected
                  ? "border-blue-600 bg-blue-50/50 shadow-md"
                  : "border-border hover:border-blue-300"
              }`}
            >
              {p.highlight && (
                <Badge className="absolute -top-2 right-4 bg-linear-to-r from-blue-600 to-purple-500">
                  Mais popular
                </Badge>
              )}
              <div className="flex items-start gap-4">
                <div
                  className={`w-11 h-11 rounded-lg flex items-center justify-center shrink-0 ${
                    isSelected
                      ? "bg-blue-600 text-white"
                      : "bg-blue-100 text-blue-600"
                  }`}
                >
                  {/* <Icon className="h-5 w-5" /> */}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline justify-between gap-2">
                    <h3 className="font-bold text-lg text-blue-950">
                      {p.name}
                    </h3>
                    <div className="text-right shrink-0">
                      <span className="text-2xl font-bold text-blue-700">
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
                  <div className="flex flex-wrap gap-x-3 gap-y-1">
                    {p.features?.map((f) => (
                      <span
                        key={f.id}
                        className="text-xs text-muted-foreground flex items-center gap-1"
                      >
                        <Check className="h-3 w-3 text-blue-600" /> {f.name}
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
