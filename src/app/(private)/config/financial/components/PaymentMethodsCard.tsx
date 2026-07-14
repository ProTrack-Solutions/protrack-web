"use client";
import { DialogNewPaymentMethod } from "@/components/DialogNewPaymentMethods";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { PaymentMethod } from "@/enum/methodPayments";
import { usePaymentMethods } from "@/hooks/usePaymentMethods";
import { TogglePaymentMethod } from "@/service/payment-methods.service";
import { CreditCard, Plus } from "lucide-react";
import { useState } from "react";

const getMethodTypeIcon = (type: string) => {
  switch (type) {
    case PaymentMethod.Cash:
      return "💵";
    case PaymentMethod.CreditCard:
      return "💳";
    case PaymentMethod.DebitCard:
      return "💳";
    case PaymentMethod.Pix:
      return "📱";
    case PaymentMethod.BankTransfer:
      return "🏦";
    default:
      return "💰";
  }
};

export function PaymentMethodsCard() {
  const [dialogOpen, setDialogOpen] = useState(false);

  const { paymentMethods, refetch } = usePaymentMethods();

  const handleTogglePaymentMethod = async (
    methodId: string,
    isActive: boolean,
  ) => {
    const newStatus = !isActive;
    try {
      await TogglePaymentMethod(methodId, { is_active: newStatus });
    } catch (error) {
      console.log(error);
    } finally {
      refetch();
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Métodos de Pagamento
          </CardTitle>
          <Button
            className="cursor-pointer"
            onClick={() => setDialogOpen(true)}
          >
            <Plus className="h-4 w-4 mr-2" /> Novo método
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {paymentMethods?.map((method) => (
            <div
              key={method.id}
              className="flex items-center justify-between p-4 rounded-lg border"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">
                  {getMethodTypeIcon(method.type)}
                </span>
                <div>
                  <p className="font-medium text-foreground">{method.name}</p>
                  <p className="text-sm text-muted-foreground capitalize">
                    {method.type}
                  </p>
                </div>
              </div>
              <Switch
                checked={method.is_active}
                onCheckedChange={(checked) => {
                  console.log("clicou!", checked, method.id);
                  handleTogglePaymentMethod(method.id, method.is_active);
                }}
              />
            </div>
          ))}
        </div>
      </CardContent>
      <DialogNewPaymentMethod open={dialogOpen} onOpenChange={setDialogOpen} />
    </Card>
  );
}
