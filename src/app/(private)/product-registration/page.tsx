"use client";

import { useState } from "react";
import { CadastroProdutoResumo } from "./components/CadastroProdutoResumo";
import { FormEstoque } from "./components/FormEstoque";
import { FormInfoBasica } from "./components/FormInfoBasica";
import { FormPrecificacao } from "./components/FormPrecificacao";
import { Header } from "@/components/Header";
import { CreateProduct } from "@/service/products.service";
import { toast } from "sonner";
import {
  CreateProductParams,
  initialFormData,
} from "@/interfaces/products.interface";

export default function ProductRegistration() {
  const [formData, setFormData] =
    useState<CreateProductParams>(initialFormData);
  const [loading, setLoading] = useState(false);

  const handleChange = (
    field: keyof CreateProductParams,
    value: string | number,
  ) => {
    const numericFields: (keyof CreateProductParams)[] = [
      "quantity",
      "cost_price",
      "sale_price",
    ];

    const finalValue = numericFields.includes(field)
      ? value === ""
        ? 0
        : Number(value)
      : value;

    setFormData((prev) => ({ ...prev, [field]: finalValue }));
  };

  const handleReset = () => {
    setFormData(initialFormData);
  };

  const handleCreateProduct = async () => {
    try {
      setLoading(true);
      console.log("handleCreateProduct", formData);
      await CreateProduct(formData);
      toast.success("Produto cadastrado com sucesso!");
    } catch (error) {
      console.log(error);
      toast.error("Erro ao cadastrar produto!");
    } finally {
      setLoading(false);
      setFormData(initialFormData);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <Header
        title="Bem-vindo à página cadastro de produtos!"
        text="Aqui você pode cadastrar novos produtos no estoque."
      />
      <div className="p-6 space-y-6 mx-auto">
        <form className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <FormInfoBasica formData={formData} onChange={handleChange} />
            <FormEstoque formData={formData} onChange={handleChange} />
            <FormPrecificacao formData={formData} onChange={handleChange} />
          </div>

          <div className="space-y-6">
            <CadastroProdutoResumo
              formData={formData}
              onReset={handleReset}
              handleCreateProduct={handleCreateProduct}
              loading={loading}
            />
          </div>
        </form>
      </div>
    </div>
  );
}
