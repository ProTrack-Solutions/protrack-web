import {
  CatalogCategory,
  CatalogProduct,
  CatalogSearchResponse,
  CreateVariationsParams,
  ListPurchaseOrdersParams,
  ListPurchaseOrdersResponse,
  PurchaseEmailKind,
  PurchaseOrderDetail,
  ReceivePurchaseParams,
  SavePurchaseOrderParams,
} from "@/interfaces/purchases.interface";
import { api } from "./api";

export const ListPurchaseOrders = async (
  params: ListPurchaseOrdersParams,
): Promise<ListPurchaseOrdersResponse> => {
  const response = await api.get<ListPurchaseOrdersResponse>(
    "/purchases/orders",
    { params },
  );
  return response.data;
};

export const GetPurchaseOrder = async (
  id: string,
): Promise<PurchaseOrderDetail> => {
  const response = await api.get<PurchaseOrderDetail>(
    `/purchases/orders/${id}`,
  );
  return response.data;
};

export const CreatePurchaseOrder = async (
  params: SavePurchaseOrderParams,
): Promise<PurchaseOrderDetail> => {
  const response = await api.post<PurchaseOrderDetail>(
    "/purchases/orders",
    params,
  );
  return response.data;
};

export const UpdatePurchaseOrder = async (
  id: string,
  params: SavePurchaseOrderParams,
): Promise<PurchaseOrderDetail> => {
  const response = await api.put<PurchaseOrderDetail>(
    `/purchases/orders/${id}`,
    params,
  );
  return response.data;
};

export const SendPurchaseOrder = async (
  id: string,
): Promise<PurchaseOrderDetail> => {
  const response = await api.post<PurchaseOrderDetail>(
    `/purchases/orders/${id}/send`,
  );
  return response.data;
};

export const ClosePurchaseOrder = async (
  id: string,
  reason: string,
): Promise<PurchaseOrderDetail> => {
  const response = await api.post<PurchaseOrderDetail>(
    `/purchases/orders/${id}/close`,
    { reason },
  );
  return response.data;
};

export const CancelPurchaseOrder = async (
  id: string,
  reason: string,
): Promise<PurchaseOrderDetail> => {
  const response = await api.post<PurchaseOrderDetail>(
    `/purchases/orders/${id}/cancel`,
    { reason },
  );
  return response.data;
};

export const ReceivePurchaseOrder = async (
  id: string,
  params: ReceivePurchaseParams,
): Promise<PurchaseOrderDetail> => {
  const response = await api.post<PurchaseOrderDetail>(
    `/purchases/orders/${id}/receipts`,
    params,
  );
  return response.data;
};

export const ReversePurchaseReceipt = async (
  receiptId: string,
  reason: string,
): Promise<PurchaseOrderDetail> => {
  const response = await api.post<PurchaseOrderDetail>(
    `/purchases/receipts/${receiptId}/reverse`,
    { reason },
  );
  return response.data;
};

export const SearchCatalogProducts = async (params: {
  search?: string;
  page?: number;
  per_page?: number;
}): Promise<CatalogSearchResponse> => {
  const response = await api.get<CatalogSearchResponse>(
    "/purchases/catalog/products",
    { params },
  );
  return response.data;
};

export const ListModelVariations = async (
  modelName: string,
): Promise<CatalogProduct[]> => {
  const response = await api.get<CatalogProduct[]>("/purchases/catalog/models", {
    params: { name: modelName },
  });
  return response.data;
};

export const ListCatalogCategories = async (): Promise<CatalogCategory[]> => {
  const response = await api.get<CatalogCategory[]>(
    "/purchases/catalog/categories",
  );
  return response.data;
};

/** Cadastro rápido: um produto por combinação de cor e tamanho */
export const CreateProductVariations = async (
  params: CreateVariationsParams,
): Promise<CatalogProduct[]> => {
  const response = await api.post<CatalogProduct[]>(
    "/purchases/catalog/products",
    params,
  );
  return response.data;
};

/** Envia o pedido ao fornecedor por e-mail (PDF anexo); a entrega é assíncrona */
export const EmailPurchaseOrder = async (
  id: string,
  kind: PurchaseEmailKind,
): Promise<PurchaseOrderDetail> => {
  const response = await api.post<PurchaseOrderDetail>(
    `/purchases/orders/${id}/email`,
    { kind },
  );
  return response.data;
};
