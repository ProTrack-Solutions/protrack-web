"use client";

import { Product } from "@/@types/stock.type";
import { useMemo, useState } from "react";
import { EstoqueHeader } from "./components/EstoqueHeader";
import { EstoqueSearch } from "./components/EstoqueSearch";
import { EstoqueStats } from "./components/EstoqueStats";
import { EstoqueTable } from "./components/EstoqueTable";

const PRODUCTS: Product[] = [
  {
    nome: "Camiseta Premium Algodão",
    codigoBarras: "123456789023",
    categoria: "Vestimenta",
    tamanho: "GG",
    preco: 259.99,
    quantidade: 15,
  },
  {
    nome: "Calça Jeans Slim Fit",
    codigoBarras: "123456789024",
    categoria: "Vestimenta",
    tamanho: "M",
    preco: 189.9,
    quantidade: 5,
  },
  {
    nome: "Jaqueta Bomber Couro",
    codigoBarras: "123456789025",
    categoria: "Vestimenta",
    tamanho: "G",
    preco: 459.0,
    quantidade: 10,
  },
  {
    nome: "Tênis Esportivo Run",
    codigoBarras: "123456789026",
    categoria: "Calçados",
    tamanho: "42",
    preco: 329.99,
    quantidade: 5,
  },
  {
    nome: "Vestido Floral Verão",
    codigoBarras: "123456789027",
    categoria: "Vestimenta",
    tamanho: "P",
    preco: 159.9,
    quantidade: 13,
  },
  {
    nome: "Bolsa Couro Sintético",
    codigoBarras: "123456789028",
    categoria: "Acessórios",
    tamanho: "Único",
    preco: 219.5,
    quantidade: 5,
  },
  {
    nome: "Boné Aba Curva",
    codigoBarras: "123456789029",
    categoria: "Acessórios",
    tamanho: "Único",
    preco: 89.9,
    quantidade: 9,
  },
  {
    nome: "Camisa Social Manga Longa",
    codigoBarras: "123456789030",
    categoria: "Vestimenta",
    tamanho: "G",
    preco: 199.0,
    quantidade: 9,
  },
  {
    nome: "Relógio Digital Sport",
    codigoBarras: "123456789031",
    categoria: "Acessórios",
    tamanho: "Único",
    preco: 549.0,
    quantidade: 2,
  },
  {
    nome: 'Mochila Notebook 15"',
    codigoBarras: "123456789032",
    categoria: "Acessórios",
    tamanho: "Único",
    preco: 279.9,
    quantidade: 3,
  },
];

export default function Stock() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredProducts = useMemo(
    () =>
      PRODUCTS.filter(
        (p) =>
          p.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.codigoBarras.includes(searchTerm) ||
          p.categoria.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    [searchTerm],
  );

  const stats = useMemo(
    () => ({
      totalProdutos: PRODUCTS.length,
      totalItens: PRODUCTS.reduce((s, p) => s + p.quantidade, 0),
      valorTotal: PRODUCTS.reduce((s, p) => s + p.quantidade * p.preco, 0),
      baixoEstoque: PRODUCTS.filter((p) => p.quantidade < 5).length,
    }),
    [],
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
        <EstoqueHeader />
        <EstoqueStats stats={stats} />
        <EstoqueSearch searchTerm={searchTerm} onSearchChange={setSearchTerm} />
        <EstoqueTable products={filteredProducts} />
      </div>
    </div>
  );
}
