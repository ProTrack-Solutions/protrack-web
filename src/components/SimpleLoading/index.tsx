// components/ui/loading.tsx
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingProps {
  /** Texto exibido abaixo do spinner */
  label?: string;
  /** Tamanho do ícone */
  size?: "sm" | "md" | "lg";
  /** Ocupa a tela/container inteiro, centralizado */
  fullScreen?: boolean;
  className?: string;
}

const sizeMap = {
  sm: "h-4 w-4",
  md: "h-6 w-6",
  lg: "h-10 w-10",
};

export function SimpleLoading({
  label,
  size = "md",
  fullScreen = false,
  className,
}: LoadingProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-2 text-muted-foreground",
        fullScreen && "min-h-[60vh] w-full",
        className,
      )}
    >
      <Loader2 className={cn("animate-spin", sizeMap[size])} />
      {label && <p className="text-sm">{label}</p>}
    </div>
  );
}
