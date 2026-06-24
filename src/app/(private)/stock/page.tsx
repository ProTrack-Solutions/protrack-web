"use client";

import { Product } from "@/@types/stock.type";
import { useMemo, useState } from "react";
import { EstoqueSearch } from "./components/EstoqueSearch";
import { EstoqueStats } from "./components/EstoqueStats";
import { EstoqueTable } from "./components/EstoqueTable";
import { Header } from "@/components/Header";
import { useProducts } from "@/hooks/useProducts";
import Loading from "@/components/Loading";

export default function Stock() {
  const {
    products,
    error,
    loading,
    itensInStock,
    lowItensInStock,
    productsCount,
    totalValueInStock,
  } = useProducts();

  const [searchTerm, setSearchTerm] = useState("");

  const filteredProducts = useMemo(
    () =>
      products.filter(
        (p) =>
          p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.barcode.includes(searchTerm) ||
          p.category_name.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    [searchTerm, products],
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center w-full h-full">
        <Loading />
      </div>
    );
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <Header
        title="Bem-vindo à página estoque!"
        text="Aqui você pode visualizar todos os produtos cadastrados no sistema.."
      />
      <div className="p-6 space-y-6 mx-auto">
        <EstoqueStats
          itensInStock={itensInStock}
          lowItensInStock={lowItensInStock}
          productsCount={productsCount}
          totalValueInStock={totalValueInStock}
        />
        <EstoqueSearch searchTerm={searchTerm} onSearchChange={setSearchTerm} />
        <EstoqueTable products={filteredProducts} />
      </div>
    </div>
  );
}
