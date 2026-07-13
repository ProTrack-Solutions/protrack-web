"use client";

import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { SaleFormActions } from "./components/saleFormAction";
import { SaleInfoCard } from "./components/saleInfoCard";
import { SaleProductsTable } from "./components/saleProductTable";
import { SaleSummaryCard } from "./components/saleSummaryCard";
import { Header } from "@/components/Header";
import {
  CreateSaleParams,
  initialSaleFormData,
} from "@/interfaces/sale.interface";
import { SaleFormPaymentMethod } from "./components/saleFormPaymentMethod";
import { useProducts } from "@/hooks/useProducts";
import { useClients } from "@/hooks/useClients";
import { Loading } from "@/components/Loading";
import { CreateSale } from "@/service/sale.service";
import { toast } from "sonner";

export default function Sale() {
  const form = useForm<CreateSaleParams>({
    defaultValues: initialSaleFormData,
  });

  const { products, loading: loadingProducts } = useProducts();

  const { clients, loading: loadingClients } = useClients();

  const onSubmit = async (data: CreateSaleParams) => {
    try {
      console.log("Dados prontos para enviar para o back-end:", data);
      await CreateSale(data);
      toast.success("Venda cadastrado com sucesso!");
    } catch (error) {
      console.log(error);
      toast.error("Erro ao cadastrar venda!");
    } finally {
      form.reset();
    }
  };

  if (loadingClients && loadingProducts) {
    return <Loading />;
  }

  return (
    <div className="p-6 space-y-6">
      <Header
        title="Bem-vindo à página vendas!"
        text="Aqui você pode cadastrar novas vendas."
      />

      <Form {...form}>
        <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SaleInfoCard clients={clients} />
            <SaleSummaryCard products={products} />
          </div>

          <SaleFormPaymentMethod />

          <SaleProductsTable products={products} />

          <SaleFormActions />
        </form>
      </Form>
    </div>
  );
}
