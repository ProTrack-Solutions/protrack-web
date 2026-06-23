"use client";

import {
  ProductFormData,
  initialFormData,
} from "@/@types/product-registration.type";
import { useState } from "react";
import { CadastroProdutoResumo } from "./components/CadastroProdutoResumo";
import { FormEstoque } from "./components/FormEstoque";
import { FormInfoBasica } from "./components/FormInfoBasica";
import { FormPrecificacao } from "./components/FormPrecificacao";
import { Header } from "@/components/Header";

export default function ProductRegistration() {
  const [formData, setFormData] = useState<ProductFormData>(initialFormData);

  const handleChange = (field: keyof ProductFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nome || !formData.categoria || !formData.precoVenda) {
      return;
    }

    setFormData(initialFormData);
  };

  const handleReset = () => {
    setFormData(initialFormData);
  };

  return (
    <div className="p-6 space-y-6">
      <Header
        title="Bem-vindo à página cadastro de produtos!"
        text="Aqui você pode cadastrar novos produtos no estoque."
      />

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        <div className="lg:col-span-2 space-y-6">
          <FormInfoBasica formData={formData} onChange={handleChange} />
          <FormEstoque formData={formData} onChange={handleChange} />
          <FormPrecificacao formData={formData} onChange={handleChange} />
        </div>

        <div className="space-y-6">
          <CadastroProdutoResumo formData={formData} onReset={handleReset} />
        </div>
      </form>
    </div>
  );
}
