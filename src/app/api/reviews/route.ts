import { apiService } from '@/features/services/api-service';
import { API_URL } from '@/shared/config';
import { processDefaultGetRequest } from '@/app/utils';

async function fetchReviews() {
  return apiService.request(
    `${API_URL}/reviews`,
    {
      headers: { 
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      }
    }
  );
}

export async function GET() {
  return processDefaultGetRequest(fetchReviews);
}
