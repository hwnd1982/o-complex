import { API_URL } from '@/shared/config';
import { apiService } from '@/features/services/api-service';
import { processGetApiRequest, ProductsParams } from '@/app/utils';
import type { Product } from '@/shared/store/slices/products-slice';

export interface ProductsApiResponse {
  page: number;
  amount: number;
  total: number;
  items: Product[];
}

async function fetchProducts(params: ProductsParams): Promise<ProductsApiResponse> {
  return apiService.request<ProductsApiResponse>(
    `${API_URL}/products?page=${params.page}&page_size=${params.page_size}`
  );
}

export async function GET(request: Request) {
  return processGetApiRequest(request, fetchProducts);
}
