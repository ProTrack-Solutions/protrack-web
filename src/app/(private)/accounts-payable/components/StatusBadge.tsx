import { Badge } from "@/components/ui/badge";

interface ContaPagarStatusBadgeProps {
  status: string;
}

export function ContaPagarStatusBadge({ status }: ContaPagarStatusBadgeProps) {
  switch (status) {
    case "paid":
      return (
        <Badge
          variant="secondary"
          className="bg-secondary text-secondary-foreground"
        >
          Pago
        </Badge>
      );
    case "scheduled":
      return (
        <Badge variant="outline" className="border-primary text-primary">
          Agendado
        </Badge>
      );
    case "overdue":
      return <Badge variant="destructive">Vencido</Badge>;
    default:
      return <Badge variant="outline">Pendente</Badge>;
  }
}
