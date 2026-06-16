"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { VendaForm, vendaSchema } from "@/@types/sale.type";
import { SaleFormActions } from "./components/saleFormAction";
import { SaleHeader } from "./components/saleHeader";
import { SaleInfoCard } from "./components/saleInfoCard";
import { SaleProductsTable } from "./components/saleProductTable";
import { SaleSummaryCard } from "./components/saleSummaryCard";

export default function Sale() {
  const form = useForm<VendaForm>({
    resolver: zodResolver(vendaSchema),
    defaultValues: {
      clienteId: "",
      dataVenda: new Date().toISOString().split("T")[0],
      produtos: [{ produtoId: "", quantidade: 1, precoUnitario: 0 }],
    },
  });

  const onSubmit = (data: VendaForm) => {
    console.log("Dados da venda:", data);
    alert("Venda cadastrada com sucesso!");
    form.reset();
  };

  return (
    <div className="p-6 space-y-6 flex-1">
      <SaleHeader />

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
