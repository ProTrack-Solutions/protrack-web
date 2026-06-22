export interface ProductFormData {
  nome: string;
  descricao: string;
  categoria: string;
  codigoBarras: string;
  tamanho: string;
  quantidade: string;
  precoCusto: string;
  precoVenda: string;
}

export const initialFormData: ProductFormData = {
  nome: "",
  descricao: "",
  categoria: "",
  codigoBarras: "",
  tamanho: "",
  quantidade: "",
  precoCusto: "",
  precoVenda: "",
};
