import {
  GetTopProductsResponse,
  ProductResponse,
  ProductUpdateParams,
  CreateProductParams,
  GetTotalInStockResponse,
  CreateStockMovementParams,
  StockMovement,
  StockEntriesResponse,
  ModelVariation,
  CreateModelParams,
  AddVariationsParams,
  UpdateModelParams,
  GridStockMovementParams,
  GroupProductsParams,
} from "@/interfaces/products.interface";
import { api } from "./api";
import { Pagination } from "@/interfaces/pagination.interface";

export const GetProducts = async (
  PaginationParams: Pagination,
): Promise<ProductResponse> => {
  const response = await api.get<ProductResponse>("/product/company", {
    params: {
      page: PaginationParams.Page,
      perPage: PaginationParams.PerPage,
      startDate: PaginationParams.StartDate,
      endDate: PaginationParams.EndDate,
      search: PaginationParams.Search,
      orderBy: PaginationParams.OrderBy,
    },
  });
  return response.data;
};

export const CreateProduct = async (params: CreateProductParams) => {
  const response = await api.post("/product", params);
  console.log("CreateProduct", params);
  return response.data;
};

export const UpdateProcut = async (
  productId: string,
  params: ProductUpdateParams,
) => {
  const response = await api.put(`/product/${productId}`, params);
  return response.data;
};

export const CreateStockMovement = async (
  productId: string,
  params: CreateStockMovementParams,
): Promise<StockMovement> => {
  const response = await api.post<{ stock_movement: StockMovement }>(
    `/product/${productId}/stock-movements`,
    params,
  );
  return response.data.stock_movement;
};

export const GetTopProducts = async (): Promise<GetTopProductsResponse[]> => {
  const response = await api.get<GetTopProductsResponse[]>(
    "/product/top-products",
  );
  return response.data;
};

export const GetTotalInStock = async (): Promise<GetTotalInStockResponse> => {
  const response = await api.get<GetTotalInStockResponse>(
    "/product/cost-total",
  );
  return response.data;
};

// --- Grade de produtos (o modelo vai em ?name= porque o nome pode ter "/") ---

/** Estoque agrupado: cada modelo vira uma linha com os totais das variações */
export const GetStockEntries = async (
  params: Pagination,
): Promise<StockEntriesResponse> => {
  const response = await api.get<StockEntriesResponse>("/product/stock", {
    params: {
      page: params.Page,
      perPage: params.PerPage,
      startDate: params.StartDate,
      endDate: params.EndDate,
      search: params.Search,
      orderBy: params.OrderBy,
    },
  });
  return response.data;
};

export const GetModelVariations = async (
  modelName: string,
): Promise<ModelVariation[]> => {
  const response = await api.get<{ variations: ModelVariation[] }>(
    "/product/models",
    { params: { name: modelName } },
  );
  return response.data.variations;
};

export const CreateModel = async (
  params: CreateModelParams,
): Promise<ModelVariation[]> => {
  const response = await api.post<{ variations: ModelVariation[] }>(
    "/product/models",
    params,
  );
  return response.data.variations;
};

export const UpdateModel = async (
  modelName: string,
  params: UpdateModelParams,
): Promise<ModelVariation[]> => {
  const response = await api.put<{ variations: ModelVariation[] }>(
    "/product/models",
    params,
    { params: { name: modelName } },
  );
  return response.data.variations;
};

export const AddModelVariations = async (
  modelName: string,
  params: AddVariationsParams,
): Promise<ModelVariation[]> => {
  const response = await api.post<{ variations: ModelVariation[] }>(
    "/product/models/variations",
    params,
    { params: { name: modelName } },
  );
  return response.data.variations;
};

/** Só variações sem saldo */
export const RemoveModelVariation = async (variationId: string) => {
  await api.delete(`/product/models/variations/${variationId}`);
};

export const CreateGridStockMovement = async (
  modelName: string,
  params: GridStockMovementParams,
): Promise<StockMovement[]> => {
  const response = await api.post<{ stock_movements: StockMovement[] }>(
    "/product/models/stock-movements",
    params,
    { params: { name: modelName } },
  );
  return response.data.stock_movements;
};

/** Transforma produtos soltos em variações de um modelo (novo ou existente) */
export const GroupProductsIntoModel = async (
  params: GroupProductsParams,
): Promise<ModelVariation[]> => {
  const response = await api.post<{ variations: ModelVariation[] }>(
    "/product/models/group",
    params,
  );
  return response.data.variations;
};
