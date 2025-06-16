import { NextResponse } from 'next/server';
import { z } from 'zod';
import { ClientError, ServerError } from '@/features/services/api-service';

// Схемы валидации с использованием Zod
export const OrderRequestSchema = z.object({
  phone: z.string().min(5, "Phone number is too short"),
  cart: z.array(z.object({
    id: z.coerce.number().positive("Invalid product ID"), // Используем coerce
    quantity: z.number().positive("Quantity must be positive")
  })).nonempty("Cart cannot be empty")
});

const ProductsParamsSchema = z.object({
  page: z.string().optional().default('1'),
  page_size: z.string().optional().default('6')
});

// Типы на основе схем валидации
export type OrderRequest = z.infer<typeof OrderRequestSchema>;
export type ProductsParams = z.infer<typeof ProductsParamsSchema>;

// Базовый обработчик ошибок
export function handleApiError(error: unknown): NextResponse {
  console.error('API Error:', error);
  
  if (error instanceof ClientError) {
    return NextResponse.json(
      { error: error.message },
      { status: error.status || 400 }
    );
  }
  
  if (error instanceof ServerError) {
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: error.status || 500 }
    );
  }
  
  if (error instanceof z.ZodError) {
    return NextResponse.json(
      { error: 'Validation failed', details: error.errors },
      { status: 422 }
    );
  }
  
  return NextResponse.json(
    { error: 'An unexpected error occurred' },
    { status: 500 }
  );
}

// Обработчик для POST запросов
export async function processApiRequest<T>(
  request: Request,
  handler: (body: OrderRequest) => Promise<T>
): Promise<NextResponse> {
  try {
    const json = await request.json();
    const body = OrderRequestSchema.parse(json);
    const result = await handler(body);
    return NextResponse.json(result);
  } catch (error) {
    return handleApiError(error);
  }
}

// Обработчик для GET запросов с параметрами
export async function processGetApiRequest<T>(
  request: Request,
  handler: (params: ProductsParams) => Promise<T>
): Promise<NextResponse> {
  try {
    const url = new URL(request.url);
    const params = Object.fromEntries(url.searchParams.entries());
    const validatedParams = ProductsParamsSchema.parse(params);
    const result = await handler(validatedParams);
    return NextResponse.json(result);
  } catch (error) {
    return handleApiError(error);
  }
}

// Обработчик для GET запросов без параметров
export async function processDefaultGetRequest<T>(
  handler: () => Promise<T>
): Promise<NextResponse> {
  try {
    const result = await handler();
    return NextResponse.json(result);
  } catch (error) {
    return handleApiError(error);
  }
}
