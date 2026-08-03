import { CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  UserData,
  CompanyData,
  PaymentData,
} from "@/interfaces/auth.interface";
import { PlansResponse } from "@/interfaces/plans.interface";

interface SuccessStepProps {
  user: UserData;
  company: CompanyData;
  payment: PaymentData;
  plan: PlansResponse;
  onFinish: () => void;
}

export default function SuccessStep({
  user,
  company,
  payment,
  plan,
  onFinish,
}: SuccessStepProps) {
  return (
    <div className="text-center space-y-6">
      <div className="w-20 h-20 mx-auto rounded-full bg-linear-to-br from-blue-500 to-purple-500 flex items-center justify-center">
        <CheckCircle2 className="h-10 w-10 text-white" />
      </div>
      <div>
        <p className="text-lg text-blue-950">
          Bem-vindo(a), <strong>{user.name.split(" ")[0] || "usuário"}</strong>!
        </p>
        <p className="text-muted-foreground text-sm mt-1">
          Plano <strong>{plan.name}</strong> ativado com sucesso.
        </p>
      </div>
      <div className="rounded-xl bg-muted/40 border p-4 space-y-2 text-left text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Usuário:</span>
          <span className="font-medium truncate ml-2">{user.username}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Email:</span>
          <span className="font-medium truncate ml-2">{user.email}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Empresa:</span>
          <span className="font-medium truncate ml-2">
            {company.trade_name}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">CNPJ:</span>
          <span className="font-medium">{company.document}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Cartão:</span>
          <span className="font-medium">
            {payment.card_brand} •••• {payment.card_last_four}
          </span>
        </div>
        <div className="flex justify-between pt-2 border-t">
          <span className="text-muted-foreground">Total mensal:</span>
          <span className="font-bold text-blue-700">
            R${plan.price_cents / 100}
          </span>
        </div>
      </div>
      <Button
        size="lg"
        onClick={onFinish}
        className="w-full h-12 bg-blue-600 hover:bg-blue-700"
      >
        Acessar sistema <ArrowRight className="h-4 w-4 ml-2" />
      </Button>
    </div>
  );
}
