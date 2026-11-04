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
import { useQueryClient } from "@tanstack/react-query";
import { CASH_REGISTER_KEY } from "@/hooks/useCashRegister";
import { CUSTOMER_CREDIT_KEY } from "@/hooks/useReturns";
import { CashRegisterStatus } from "./components/CashRegisterStatus";
import { PaymentMethod } from "@/enum/methodPayments";
import { BookletSale, DialogPrintBooklet } from "./components/DialogPrintBooklet";
import { validateSale } from "./components/validateSale";
import { parseSaleApiError } from "./components/saleApiError";

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
  const [bookletSale, setBookletSale] = useState<BookletSale | null>(null);

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

  const queryClient = useQueryClient();

  const onSubmit = async (data: CreateSaleParams) => {
    form.clearErrors();

    // Confere no front com as mesmas regras da API antes de enviar
    const errors = validateSale(data, productsForSummary);
    if (errors.length > 0) {
      errors.forEach(({ field, message }) => {
        if (field !== "root") form.setError(field, { type: "validate", message });
      });
      const first = errors[0];
      toast.error("Confira os dados da venda", {
        description:
          errors.length > 1
            ? `${first.message} (e mais ${errors.length - 1} ${errors.length - 1 === 1 ? "pendência" : "pendências"})`
            : first.message,
      });
      const firstField = errors.find((e) => e.field !== "root")?.field;
      if (firstField && firstField !== "root") form.setFocus(firstField);
      return;
    }

    try {
      const payload = { ...data };

      if (!payload.customer_id) {
        delete payload.customer_id;
      }

      // Vale-troca só com cliente e fora da venda a prazo
      if (
        !payload.credit_amount ||
        !payload.customer_id ||
        payload.payment_method === PaymentMethod.Installments
      ) {
        delete payload.credit_amount;
      }

      // Valor recebido só vale para o que é pago em dinheiro no balcão
      const paidInCash =
        payload.payment_method === PaymentMethod.Cash ||
        (payload.payment_method === PaymentMethod.Installments &&
          payload.prohibited > 0);
      if (!payload.amount_received || !paidInCash) {
        delete payload.amount_received;
      }

      const { id: saleId } = await CreateSale(payload);
      toast.success("Venda cadastrada com sucesso!");
      // Venda no crediário: oferece imprimir o carnê de pagamento para o cliente
      if (payload.payment_method === PaymentMethod.Installments && saleId) {
        setBookletSale({ saleId, installments: payload.installments_count });
      }
      // A venda entra no resumo do caixa aberto
      queryClient.invalidateQueries({ queryKey: [CASH_REGISTER_KEY] });
      if (payload.credit_amount) {
        queryClient.invalidateQueries({ queryKey: [CUSTOMER_CREDIT_KEY] });
      }

      // Só limpa o formulário quando a venda foi gravada; em caso de erro o usuário corrige e reenvia
      form.reset();
      setSelectedProducts({});
      setProductSearch("");
      setClientSearch("");
    } catch (error) {
      console.error(error);
      const { title, description, field, refresh } = parseSaleApiError(error);
      toast.error(title, { description });
      if (field) form.setError(field, { type: "server", message: description });

      // O erro mostra que a tela está desatualizada: recarrega o que mudou
      if (refresh === "cash-register") {
        queryClient.invalidateQueries({ queryKey: [CASH_REGISTER_KEY] });
      } else if (refresh === "products") {
        queryClient.invalidateQueries({ queryKey: ["products-select"] });
      } else if (refresh === "clients") {
        queryClient.invalidateQueries({ queryKey: ["clients-select"] });
      }
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

      <CashRegisterStatus />

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

          <SaleFormPaymentMethod products={productsForSummary} />

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

      <DialogPrintBooklet
        sale={bookletSale}
        onClose={() => setBookletSale(null)}
      />
    </div>
  );
}
