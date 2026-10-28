import { Badge } from "@/components/ui/badge";
import { BillsPayableStatus } from "@/enum/billsPayableStatus.enum";

interface StatusBadgeProps {
  status: string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  switch (status) {
    case BillsPayableStatus.StatusPaid:
      return (
        <Badge
          variant="secondary"
          className="bg-secondary text-secondary-foreground"
        >
          Pago
        </Badge>
      );
    case BillsPayableStatus.StatusPartial:
      return (
        <Badge variant="outline" className="border-secondary text-secondary">
          Parcial
        </Badge>
      );
    case BillsPayableStatus.StatusOverdue:
      return <Badge variant="destructive">Vencido</Badge>;
    case BillsPayableStatus.StatusCanceled:
      return (
        <Badge variant="outline" className="text-muted-foreground line-through">
          Cancelado
        </Badge>
      );
    default:
      return <Badge variant="outline">Pendente</Badge>;
  }
}
