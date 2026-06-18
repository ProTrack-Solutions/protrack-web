import { Card, CardContent } from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";

interface CardSectionProps {
  icon: LucideIcon;
  iconGradient: string;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}

export function CardSection({
  icon: Icon,
  iconGradient,
  title,
  subtitle,
  children,
}: CardSectionProps) {
  return (
    <Card className="border-border/50">
      <CardContent className="p-6 space-y-5">
        <div className="flex items-center gap-3 pb-2 border-b border-border/50">
          <div
            className={`w-10 h-10 rounded-xl bg-gradient-to-br ${iconGradient} flex items-center justify-center shadow-sm`}
          >
            <Icon className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">{title}</h2>
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          </div>
        </div>
        {children}
      </CardContent>
    </Card>
  );
}
