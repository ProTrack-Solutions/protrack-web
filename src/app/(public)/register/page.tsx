"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";

import StepSidebar from "./components/StepSidebar";
import CompanyStep from "./components/CompanyStep";
import UserStep from "./components/UserStep";
import PlanStep from "./components/PlanStep";
import PaymentStep from "./components/PaymentStep";
import SuccessStep from "./components/SuccessStep";

import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

import { onlyDigits, steps, stepTitles } from "./constants";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import {
  CompanyData,
  UserData,
  PaymentData,
  RegisterParams,
} from "@/interfaces/auth.interface";
import { Register as register } from "@/service/auth.service";
import { PlansResponse } from "@/interfaces/plans.interface";

export default function Register() {
  const navigate = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);

  const [company, setCompany] = useState<CompanyData>({
    name: "",
    trade_name: "",
    document: "",
    email: "",
    phone: "",
    website: "",
    address_street: "",
    address_number: "",
    address_complement: "",
    address_neighborhood: "",
    address_city: "",
    address_state: "",
    address_zipcode: "",
    address_country: "BR",
    timezone: "America/Sao_Paulo",
  });

  const [user, setUser] = useState<UserData>({
    name: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
    document: "",
  });

  const [selectedPlan, setSelectedPlan] = useState<PlansResponse>({
    active: true,
    billing_cycle: "",
    created_at: new Date(),
    currency: "",
    description: "",
    external_id: "",
    features: [],
    highlight: true,
    icon: "",
    id: "",
    name: "",
    price_cents: 0,
    updated_at: new Date(),
  });

  const [payment, setPayment] = useState<PaymentData>({
    card_brand: "",
    card_exp_month: 0,
    card_exp_year: 0,
    card_last_four: "",
    card_token: "",
    plan_id: "",
    type: "card",
    card_holder: "",
  });

  // Etapa 1 = Empresa, Etapa 2 = Usuário, Etapa 3 = Plano, Etapa 4 = Pagamento
  const validateStep = (step: number): boolean => {
    if (step === 1) {
      const required: [string, string][] = [
        [company.name, "Razão social"],
        [company.trade_name, "Nome fantasia"],
        [company.document, "CNPJ"],
        [company.email, "E-mail da empresa"],
        [company.phone, "Telefone"],
        [company.address_street, "Rua"],
        [company.address_number, "Número"],
        [company.address_neighborhood, "Bairro"],
        [company.address_city, "Cidade"],
        [company.address_state, "Estado"],
        [company.address_zipcode, "CEP"],
      ];
      const missing = required.find(([v]) => !v);
      if (missing) {
        toast(`Informe: ${missing[1]}`);
        return false;
      }
      if (onlyDigits(company.document).length !== 14) {
        toast("CNPJ deve conter 14 dígitos");
        return false;
      }
    }
    if (step === 2) {
      if (
        !user.name ||
        !user.email ||
        !user.username ||
        !user.password ||
        !user.document
      ) {
        toast("Preencha todos os campos do usuário");
        return false;
      }
      if (onlyDigits(user.document).length !== 11) {
        toast("CPF deve conter 11 dígitos");
        return false;
      }
      if (user.password.length < 8) {
        toast("Senha deve ter pelo menos 8 caracteres");
        return false;
      }
      if (user.password !== user.confirmPassword) {
        toast("As senhas não coincidem");
        return false;
      }
    }
    if (step === 4) {
      if (!payment?.card_holder) {
        toast("Informe o nome impresso no cartão");
        return false;
      }
    }
    return true;
  };

  const stripe = useStripe();
  const elements = useElements();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (): Promise<void> => {
    if (!stripe || !elements) {
      toast("Aguarde o carregamento do formulário de pagamento.");
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      return;
    }

    setIsSubmitting(true);

    try {
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: "card",
        card: cardElement,
        billing_details: {
          name: payment?.card_holder,
          email: company.email,
        },
      });
      if (error) {
        throw new Error(error.message || "Erro ao validar dados do cartão.");
      }

      const payload: RegisterParams = {
        company: {
          name: company.name,
          trade_name: company.trade_name,
          document: company.document,
          email: company.email,
          phone: company.phone,
          website: company.website || "",
          address_street: company.address_street,
          address_number: company.address_number,
          address_complement: company.address_complement || "",
          address_neighborhood: company.address_neighborhood,
          address_city: company.address_city,
          address_state: company.address_state,
          address_zipcode: company.address_zipcode,
          address_country: company.address_country || "BR",
          timezone: company.timezone || "America/Sao_Paulo",
        },
        user: {
          name: user.name,
          email: user.email,
          username: user.username,
          password: user.password,
          document: user.document,
        },
        payment: {
          card_brand: paymentMethod.card?.brand || "",
          card_exp_month: paymentMethod.card?.exp_month || 0,
          card_exp_year: paymentMethod.card?.exp_year || 0,
          card_last_four: String(paymentMethod.card?.last4),
          card_token: paymentMethod.id,
          plan_id: selectedPlan?.id ?? "",
          type: "card",
        },
        idempotency_key: crypto.randomUUID(), // Gera um UUID para idempotência
      };

      const registerResponse = await register(payload);

      // Se o Stripe exigir confirmação do PaymentIntent (inclusive 3D
      // Secure), precisamos confirmar aqui antes de considerar o cadastro
      // concluído — senão a assinatura fica "incomplete" e expira sozinha.
      if (registerResponse.requires_action && registerResponse.client_secret) {
        const { error: confirmError, paymentIntent } =
          await stripe.confirmCardPayment(registerResponse.client_secret);

        if (confirmError) {
          throw new Error(
            confirmError.message ||
              "Não foi possível confirmar o pagamento. Verifique os dados do cartão e tente novamente.",
          );
        }

        if (paymentIntent?.status !== "succeeded") {
          throw new Error(
            "Pagamento não confirmado. Tente novamente ou utilize outro cartão.",
          );
        }
      }

      if (currentStep < steps.length) setCurrentStep(currentStep + 1);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Erro ao concluir o cadastro. Tente novamente.";
      toast(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNext = async () => {
    if (!validateStep(currentStep)) return;
    if (currentStep < steps.length) setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleFinish = () => {
    toast(`Bem-vindo`);
    navigate.push("/login");
  };

  return (
    <div className="min-h-screen flex bg-background">
      <StepSidebar currentStep={currentStep} />

      <div className="flex-1 flex flex-col p-6 lg:p-12 overflow-y-auto">
        <div className="flex items-center justify-between mb-8">
          <Button variant="ghost" size="sm" asChild>
            <Link href={"/"}>
              <ArrowLeft className="h-4 w-4 mr-2" /> Voltar
            </Link>
          </Button>
          <div className="text-sm text-muted-foreground">
            Etapa <span className="font-bold text-blue-600">{currentStep}</span>{" "}
            de {steps.length}
          </div>
        </div>

        <div className="max-w-lg w-full mx-auto flex-1 flex flex-col justify-center">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-blue-700">
              {stepTitles[currentStep].title}
            </h2>
            <p className="text-muted-foreground mt-2">
              {stepTitles[currentStep].subtitle}
            </p>
          </div>

          {currentStep === 1 && (
            <CompanyStep company={company} setCompany={setCompany} />
          )}

          {currentStep === 2 && (
            <UserStep
              user={user}
              setUser={setUser}
              showPassword={showPassword}
              setShowPassword={setShowPassword}
            />
          )}

          {currentStep === 3 && (
            <PlanStep
              selectedPlan={selectedPlan}
              setSelectedPlan={setSelectedPlan}
            />
          )}

          {currentStep === 4 && (
            <PaymentStep
              payment={payment || ({} as PaymentData)}
              setPayment={setPayment}
              plan={selectedPlan}
            />
          )}

          {currentStep === 5 && (
            <SuccessStep
              user={user}
              company={company}
              payment={payment || ({} as PaymentData)}
              plan={selectedPlan}
              onFinish={handleFinish}
            />
          )}

          {currentStep < 5 && (
            <div className="flex items-center gap-3 mt-8">
              {currentStep > 1 && (
                <Button
                  variant="outline"
                  onClick={handleBack}
                  disabled={isSubmitting}
                  className="h-12 px-6"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" /> Voltar
                </Button>
              )}
              <Button
                onClick={currentStep === 4 ? handleSubmit : handleNext}
                disabled={isSubmitting}
                className="flex-1 h-12 bg-blue-600 hover:bg-blue-700 text-base font-semibold"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Confirmando pagamento...
                  </>
                ) : (
                  <>
                    {currentStep === 4 ? "Finalizar cadastro" : "Continuar"}
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          )}

          <p className="text-center text-sm text-muted-foreground mt-6">
            Já tem uma conta?{" "}
            <Link
              href="/"
              className="text-blue-600 font-semibold hover:underline"
            >
              Entrar
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
