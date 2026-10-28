import { PurchaseOrderStatus } from "@/interfaces/purchases.interface";
import { ORDER_STATUS } from "./format";

export function OrderStatusBadge({
  status,
  late = false,
}: {
  status: PurchaseOrderStatus;
  late?: boolean;
}) {
  const { label, className } = ORDER_STATUS[status];
  return (
    <span className="inline-flex flex-wrap items-center gap-1">
      <span
        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap ${className}`}
      >
        {label}
      </span>
      {late && (
        <span className="inline-flex items-center rounded-full bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-800 ring-1 ring-inset ring-red-200 dark:bg-red-500/15 dark:text-red-300 dark:ring-red-500/30">
          Atrasado
        </span>
      )}
    </span>
  );
}
