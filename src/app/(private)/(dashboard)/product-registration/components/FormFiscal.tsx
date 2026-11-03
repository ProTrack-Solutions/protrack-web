"use client";

import Link from "next/link";
import { Receipt } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { maskNCM } from "@/components/Fiscal/DialogProductFiscal";
import { CardSection } from "./CardSection";

interface FormFiscalProps {
  ncm: string;
  onChange: (ncm: string) => void;
  gridEnabled: boolean;
}

/** NCM do produto para a NFC-e (o resto da tributação vem do perfil tributário) */
export function FormFiscal({ ncm, onChange, gridEnabled }: FormFiscalProps) {
  const digits = ncm.replace(/\D/g, "");
  const invalid = digits.length > 0 && digits.length !== 8;
  return (
    <CardSection
      icon={Receipt}
      iconGradient="from-emerald-500 to-teal-600"
      title="Nota fiscal"
      subtitle={
        gridEnabled
          ? "O NCM vale para todas as cores e tamanhos do modelo"
          : "Necessário para o produto sair na NFC-e"
      }
    >
      <div className="grid gap-2 sm:max-w-xs">
        <Label htmlFor="product-ncm">NCM</Label>
        <Input
          id="product-ncm"
          inputMode="numeric"
          value={ncm}
          onChange={(e) => onChange(maskNCM(e.target.value))}
          placeholder="0000.00.00"
          aria-invalid={invalid}
        />
        <p
          className={`text-xs ${invalid ? "text-destructive" : "text-muted-foreground"}`}
        >
          {invalid
            ? "O NCM tem 8 dígitos."
            : "Opcional agora; sem NCM o produto não sai na nota."}
        </p>
      </div>
      <p className="mt-3 text-xs text-muted-foreground">
        CEST, origem e perfil tributário ficam em Produtos → Dados fiscais. Os
        impostos seguem o perfil da categoria ou o padrão da empresa ({" "}
        <Link href="/config/fiscal" className="underline">
          Configurações → Nota Fiscal
        </Link>
        ).
      </p>
    </CardSection>
  );
}
