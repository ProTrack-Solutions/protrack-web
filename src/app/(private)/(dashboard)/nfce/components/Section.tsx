import { ReactNode } from "react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

/** Bloco da tela de emissão (mesmo visual da lista de notas) */
export function Section({
  icon,
  title,
  description,
  action,
  children,
  className,
}: {
  icon: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("rounded-2xl border border-border/70 bg-card", className)}>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b p-4">
        <div className="flex items-center gap-2">
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
            {icon}
          </span>
          <div>
            <h2 className="text-sm font-semibold">{title}</h2>
            {description && <p className="text-xs text-muted-foreground">{description}</p>}
          </div>
        </div>
        {action}
      </div>
      <div className="space-y-4 p-4">{children}</div>
    </section>
  );
}

export function Field({
  label,
  id,
  hint,
  className,
  children,
}: {
  label: string;
  id: string;
  hint?: ReactNode;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn("min-w-0 space-y-1.5", className)}>
      <Label htmlFor={id}>{label}</Label>
      {children}
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}
