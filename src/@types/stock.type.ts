export interface Product {
  nome: string;
  codigoBarras: string;
  categoria: string;
  tamanho: string;
  preco: number;
  quantidade: number;
}

export interface EstoqueStats {
  totalProdutos: number;
  totalItens: number;
  valorTotal: number;
  baixoEstoque: number;
}
