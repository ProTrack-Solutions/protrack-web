import { Badge } from "@/components/ui/badge";
import { StatusConta } from "../page";

interface StatusBadgeProps {
  status: StatusConta;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  switch (status) {
    case "pago":
      return (
        <Badge
          variant="secondary"
          className="bg-secondary text-secondary-foreground"
        >
          Pago
        </Badge>
      );
    case "parcial":
      return (
        <Badge variant="outline" className="border-secondary text-secondary">
          Parcial
        </Badge>
      );
    case "vencido":
      return <Badge variant="destructive">Vencido</Badge>;
    default:
      return <Badge variant="outline">Pendente</Badge>;
  }
}
