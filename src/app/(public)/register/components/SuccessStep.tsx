import { CheckCircle2, ArrowRight } from "lucide-react";
import { authPrimaryButtonClass } from "@/components/AuthShell";
import {
  UserData,
  CompanyData,
  PaymentData,
} from "@/interfaces/auth.interface";
import { PlansResponse } from "@/interfaces/plans.interface";
import { formatDate } from "@/utils/dateFormat";

interface SuccessStepProps {
  user: UserData;
  company: CompanyData;
  payment: PaymentData;
  plan: PlansResponse;
  // Fim do teste grátis retornado pelo cadastro; null quando não há trial.
  trialEnd: string | null;
  onFinish: () => void;
}

export default function SuccessStep({
  user,
  company,
  payment,
  plan,
  trialEnd,
  onFinish,
}: SuccessStepProps) {
  return (
    <div className="text-center space-y-6">
      <div className="relative mx-auto h-20 w-20">
        <span
          aria-hidden="true"
          className="animate-ping-soft bg-gradient-primary absolute inset-0 rounded-full"
        />
        <span className="bg-gradient-primary relative grid h-20 w-20 place-items-center rounded-full shadow-[0_16px_40px_-12px_hsl(155_55%_45%/0.8)]">
          <CheckCircle2 className="h-10 w-10 text-white" />
        </span>
      </div>
      <div>
        <p className="text-lg">
          Bem-vindo(a), <strong>{user.name.split(" ")[0] || "usuário"}</strong>!
        </p>
        <p className="text-muted-foreground text-sm mt-1">
          {trialEnd ? (
            <>
              Seu teste grátis do plano <strong>{plan.name}</strong> começou.
            </>
          ) : (
            <>
              Plano <strong>{plan.name}</strong> ativado com sucesso.
            </>
          )}
        </p>
      </div>
      <div className="space-y-2 rounded-2xl border border-border bg-secondary/60 p-5 text-left text-sm">
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
        {trialEnd && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">Teste grátis até:</span>
            <span className="font-medium">{formatDate(trialEnd)}</span>
          </div>
        )}
        <div className="flex justify-between border-t border-border pt-3">
          <span className="text-muted-foreground">Total mensal:</span>
          <span className="font-display text-base font-extrabold">
            R${plan.price_cents / 100}
          </span>
        </div>
      </div>
      <button
        type="button"
        onClick={onFinish}
        className={authPrimaryButtonClass}
      >
        Acessar sistema <ArrowRight className="ml-2 h-5 w-5" />
      </button>
    </div>
  );
}
