"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";

export function BillingInfoCard() {
  return (
    <Card className="border-border/60 shadow-sm">
      <CardHeader>
        <CardTitle className="text-base">Dados de faturamento</CardTitle>
        <CardDescription>Informações da nota fiscal.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div>
          <p className="text-muted-foreground text-xs">Razão social</p>
          <p className="font-medium">Empresa Teste LTDA</p>
        </div>
        <div>
          <p className="text-muted-foreground text-xs">CNPJ</p>
          <p className="font-medium">32.937.977/0001-26</p>
        </div>
        <div>
          <p className="text-muted-foreground text-xs">E-mail de cobrança</p>
          <p className="font-medium">financeiro@empresateste.com</p>
        </div>
        <div>
          <p className="text-muted-foreground text-xs">Endereço</p>
          <p className="font-medium">
            Rua Principal, 100 — Centro, São Paulo/SP
          </p>
        </div>
        <Button
          variant="outline"
          className="w-full mt-2"
          onClick={() => toast("Funcionalidade para editar dados de faturamento.")}
        >
          Editar dados
        </Button>
      </CardContent>
    </Card>
  );
}
