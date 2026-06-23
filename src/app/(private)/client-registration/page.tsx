"use client";

import { Header } from "@/components/Header";
import { Contato } from "./components/Contato";
import { Endereco } from "./components/Endereco";
import { InformacoesPessoais } from "./components/InformacoesPessoais";
import { ResumoSidebar } from "./components/ResumoSidebar";
import {
  ClienteFormData,
  initialData,
} from "@/@types/client-registration.type";
import { useState } from "react";
import { format } from "date-fns";

export default function ClientRegistration() {
  const [formData, setFormData] = useState<ClienteFormData>(initialData);
  const [date, setDate] = useState<Date | undefined>(undefined);

  const handleChange = (field: keyof ClienteFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleDateChange = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    setFormData((prev) => ({
      ...prev,
      birth_date: selectedDate ? format(selectedDate, "yyyy-MM-dd") : "",
    }));
  };

  const handleReset = () => {
    setFormData(initialData);
    setDate(undefined);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.full_name || !formData.cpf || !formData.email) return;

    // TODO: chamar a API aqui
    console.log("Dados do cliente:", formData);

    handleReset();
  };

  return (
    <div className="p-6 space-y-6 ">
      <Header
        title="Cadastro de clientes"
        text="Preencha os dados abaixo para cadastrar um novo cliente."
      />

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6 "
      >
        <div className="lg:col-span-2 space-y-6">
          <InformacoesPessoais
            formData={formData}
            date={date}
            onChange={handleChange}
            onDateChange={handleDateChange}
          />
          <Contato formData={formData} onChange={handleChange} />
          <Endereco formData={formData} onChange={handleChange} />
        </div>

        <div>
          <ResumoSidebar formData={formData} onReset={handleReset} />
        </div>
      </form>
    </div>
  );
}
