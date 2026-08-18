"use client";

import { useEffect, useMemo, useState } from "react";
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
import { useInfiniteProducts } from "@/hooks/useInfiniteProducts";
import { useInfiniteClients } from "@/hooks/useInfiniteClients";
import { Loading } from "@/components/Loading";
import { CreateSale } from "@/service/sale.service";
import { toast } from "sonner";
import { Product } from "@/interfaces/products.interface";

function useDebouncedValue<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

export default function Sale() {
  const form = useForm<CreateSaleParams>({
    defaultValues: initialSaleFormData,
  });

  const [productSearch, setProductSearch] = useState("");
  const debouncedProductSearch = useDebouncedValue(productSearch, 300);
  const [clientSearch, setClientSearch] = useState("");
  const debouncedClientSearch = useDebouncedValue(clientSearch, 300);
  const [selectedProducts, setSelectedProducts] = useState<
    Record<string, Product>
  >({});

  const {
    products,
    loading: loadingProducts,
    fetchNextPage: fetchNextProductsPage,
    hasNextPage: hasNextProductsPage,
    isFetchingNextPage: isFetchingNextProductsPage,
  } = useInfiniteProducts(debouncedProductSearch || undefined);

  const productsForSummary = useMemo(() => {
    const byId = new Map(products.map((product) => [product?.id, product]));
    Object.values(selectedProducts).forEach((product) =>
      byId.set(product?.id, product),
    );
    return Array.from(byId.values());
  }, [products, selectedProducts]);

  const {
    clients,
    loading: loadingClients,
    fetchNextPage: fetchNextClientsPage,
    hasNextPage: hasNextClientsPage,
    isFetchingNextPage: isFetchingNextClientsPage,
  } = useInfiniteClients(debouncedClientSearch || undefined);

  const onSubmit = async (data: CreateSaleParams) => {
    try {
      const payload = { ...data };

      if (!payload.customer_id) {
        delete payload.customer_id;
      }

      console.log("Dados prontos para enviar para o back-end:", payload);
      await CreateSale(payload);
      toast.success("Venda cadastrado com sucesso!");
    } catch (error) {
      console.log(error);
      toast.error("Erro ao cadastrar venda!");
    } finally {
      form.reset();
      setSelectedProducts({});
      setProductSearch("");
      setClientSearch("");
    }
  };

  const handleProductSelected = (product: Product) => {
    setSelectedProducts((prev) => ({ ...prev, [product.id]: product }));
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
            <SaleInfoCard
              clients={clients}
              onReachEnd={fetchNextClientsPage}
              hasMore={hasNextClientsPage}
              isLoadingMore={isFetchingNextClientsPage}
              clientSearch={clientSearch}
              onClientSearchChange={setClientSearch}
              isSearchingClients={
                clientSearch !== debouncedClientSearch || loadingClients
              }
            />
            <SaleSummaryCard products={productsForSummary} />
          </div>

          <SaleFormPaymentMethod />

          <SaleProductsTable
            products={products}
            onReachEnd={fetchNextProductsPage}
            hasMore={hasNextProductsPage}
            isLoadingMore={isFetchingNextProductsPage}
            productSearch={productSearch}
            onProductSearchChange={setProductSearch}
            onProductSelected={handleProductSelected}
            isSearchingProducts={
              productSearch !== debouncedProductSearch || loadingProducts
            }
          />

          <SaleFormActions />
        </form>
      </Form>
    </div>
  );
}
