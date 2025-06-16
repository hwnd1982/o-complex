import { apiService } from '@/features/services/api-service';
import { API_URL } from '@/shared/config';
import { processApiRequest, OrderRequest } from '@/app/utils';

async function createOrder(body: OrderRequest) {
  return apiService.request(
    `${API_URL}/order`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      },
      body: JSON.stringify(body),
    },
    10
  );
}

export async function POST(request: Request) {
  return processApiRequest(request, createOrder);
}
