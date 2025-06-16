import { generatePlaceholder, replaceImageDimensions } from '@/shared';
import { NextResponse } from 'next/server';
import { ClientError, ServerError } from '@/features';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const originalUrl = url.searchParams.get('url');
    
    if (!originalUrl) {
      return generateImageResponse('No URL');
    }

    let decodedUrl = decodeURIComponent(originalUrl);
    decodedUrl = replaceImageDimensions(decodedUrl, 300, 400);
    
    const headers = createImageHeaders(decodedUrl);
    const response = await fetchImage(decodedUrl, headers);
    
    return createImageResponse(response);
  } catch (error) {
    return handleImageError(error);
  }
}

function createImageHeaders(url: string): HeadersInit {
  const headers: HeadersInit = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    'Accept': 'image/*',
  };

  if (url.includes('picsum.photos')) {
    headers['Referer'] = 'https://picsum.photos/';
  }

  return headers;
}

async function fetchImage(url: string, headers: HeadersInit): Promise<Response> {
  const response = await fetch(url, { headers });

  if (response.status === 403) {
    throw new ClientError('Blocked by provider', 403);
  }

  if (!response.ok) {
    if (response.status >= 400 && response.status < 500) {
      throw new ClientError(`Client error: ${response.status}`, response.status);
    }
    throw new ServerError(`Server error: ${response.status}`, response.status);
  }

  return response;
}

function createImageResponse(response: Response): NextResponse {
  const contentType = response.headers.get('content-type') || 'image/jpeg';
  return new NextResponse(response.body, {
    headers: {
      'Content-Type': contentType,
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
}

function generateImageResponse(message: string): NextResponse {
  return new NextResponse(generatePlaceholder(message), {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=60',
    },
  });
}

function handleImageError(error: unknown): NextResponse {
  console.error('[PROXY] Error:', error);
  
  if (error instanceof ClientError) {
    return generateImageResponse('Client Error');
  }
  
  if (error instanceof ServerError) {
    return generateImageResponse('Server Error');
  }
  
  return generateImageResponse('Error');
}
