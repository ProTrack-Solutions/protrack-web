"use client";

import { use } from "react";
import Link from "next/link";
import { Skeleton } from "@/components/DashCard";
import { Button } from "@/components/ui/button";
import { usePurchaseOrder } from "@/hooks/usePurchases";
import { getApiErrorMessage } from "@/utils/apiError";
import { OrderForm } from "../../components/OrderForm";

export default function EditPurchaseOrderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: order, isLoading, error } = usePurchaseOrder(id);

  if (isLoading) {
    return (
      <div className="space-y-6 p-6">
        <Skeleton className="h-10 w-72" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  // Pedido já recebido, encerrado ou cancelado não volta para edição
  if (!order || !order.can_edit) {
    return (
      <div className="p-6">
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-border bg-card p-10 text-center">
          <p className="font-medium text-foreground">
            {order
              ? "Este pedido não pode mais ser editado: ele já tem recebimentos ou foi encerrado."
              : getApiErrorMessage(error, "Pedido não encontrado.")}
          </p>
          <Button variant="outline" asChild>
            <Link href={order ? `/purchases/${order.id}` : "/purchases"}>Voltar</Link>
          </Button>
        </div>
      </div>
    );
  }

  return <OrderForm key={order.updated_at} order={order} />;
}
