"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CompanyResponse } from "@/interfaces/companies.interface";
import { toast } from "sonner";

interface Props {
  company: CompanyResponse;
}

export function BillingInfoCard({ company }: Props) {
  const streetNumber = [company.address_street, company.address_number]
    .filter(Boolean)
    .join(", ");
  const cityState = [company.address_city, company.address_state]
    .filter(Boolean)
    .join("/");
  const endereco = [
    streetNumber,
    [company.address_neighborhood, cityState].filter(Boolean).join(", "),
  ]
    .filter(Boolean)
    .join(" — ");

  return (
    <Card className="border-border/60 shadow-sm">
      <CardHeader>
        <CardTitle className="text-base">Dados de faturamento</CardTitle>
        <CardDescription>Informações da nota fiscal.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div>
          <p className="text-muted-foreground text-xs">Razão social</p>
          <p className="font-medium">{company.name}</p>
        </div>
        <div>
          <p className="text-muted-foreground text-xs">
            {company.document_type || "Documento"}
          </p>
          <p className="font-medium">{company.document}</p>
        </div>
        <div>
          <p className="text-muted-foreground text-xs">E-mail de cobrança</p>
          <p className="font-medium">{company.email}</p>
        </div>
        <div>
          <p className="text-muted-foreground text-xs">Endereço</p>
          <p className="font-medium">{endereco || "—"}</p>
        </div>
        <Button
          variant="outline"
          className="w-full mt-2"
          onClick={() =>
            toast("Funcionalidade para editar dados de faturamento.")
          }
        >
          Editar dados
        </Button>
      </CardContent>
    </Card>
  );
}
