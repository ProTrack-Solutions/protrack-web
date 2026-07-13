import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { CreditCard, Plus } from "lucide-react";

export interface PaymentMethod {
  id: string;
  nome: string;
  tipo: "dinheiro" | "cartao" | "pix" | "transferencia";
  ativo: boolean;
}

interface PaymentMethodsCardProps {
  methods: PaymentMethod[];
  onToggle: (id: string) => void;
}

const getMethodTypeIcon = (type: string) => {
  switch (type) {
    case "dinheiro":
      return "💵";
    case "cartao":
      return "💳";
    case "pix":
      return "📱";
    case "transferencia":
      return "🏦";
    default:
      return "💰";
  }
};

export function PaymentMethodsCard({
  methods,
  onToggle,
}: PaymentMethodsCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Métodos de Pagamento
          </CardTitle>
          <Button>
            <Plus className="h-4 w-4 mr-2" /> Novo método de pagamento
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {methods.map((method) => (
            <div
              key={method.id}
              className="flex items-center justify-between p-4 rounded-lg border"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">
                  {getMethodTypeIcon(method.tipo)}
                </span>
                <div>
                  <p className="font-medium text-foreground">{method.nome}</p>
                  <p className="text-sm text-muted-foreground capitalize">
                    {method.tipo}
                  </p>
                </div>
              </div>
              <Switch
                checked={method.ativo}
                onCheckedChange={() => onToggle(method.id)}
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
