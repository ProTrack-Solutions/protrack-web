import { Badge } from "@/components/ui/badge";
import { ContaPagar } from "../page";

interface ContaPagarStatusBadgeProps {
  status: ContaPagar["status"];
}

export function ContaPagarStatusBadge({ status }: ContaPagarStatusBadgeProps) {
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
    case "agendado":
      return (
        <Badge variant="outline" className="border-primary text-primary">
          Agendado
        </Badge>
      );
    case "vencido":
      return <Badge variant="destructive">Vencido</Badge>;
    default:
      return <Badge variant="outline">Pendente</Badge>;
  }
}
