"use client";

import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { VendaForm } from "@/@types/sale.type";
import { SaleFormActions } from "./components/saleFormAction";
import { SaleInfoCard } from "./components/saleInfoCard";
import { SaleProductsTable } from "./components/saleProductTable";
import { SaleSummaryCard } from "./components/saleSummaryCard";
import { Header } from "@/components/Header";

export default function Sale() {
  const form = useForm<VendaForm>({
    defaultValues: {
      clienteId: "",
      dataVenda: new Date().toISOString().split("T")[0],
      produtos: [],
    },
  });

  const onSubmit = (data: VendaForm) => {
    console.log("Dados da venda:", data);
    alert("Venda cadastrada com sucesso!");
    form.reset();
  };

  return (
    <div className="p-6 space-y-6">
      <Header
        title="Bem-vindo à página vendas!"
        text="Aqui você pode cadastrar novas vendas."
      />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SaleInfoCard />
            <SaleSummaryCard />
          </div>

          <SaleProductsTable />

          <SaleFormActions />
        </form>
      </Form>
    </div>
  );
}
