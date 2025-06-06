import { generatePlaceholder, replaceImageDimensions } from '@/shared';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const originalUrl = url.searchParams.get('url');
    
    if (!originalUrl) {
      return new NextResponse(generatePlaceholder('No URL'), {
        headers: {
          'Content-Type': 'image/svg+xml',
          'Cache-Control': 'public, max-age=60',
        },
      });
    }

    let decodedUrl = decodeURIComponent(originalUrl);
    console.log(`[PROXY] Original URL: ${decodedUrl}`);
    
    // Заменяем размеры на 300x400 (ширина x высота)
    decodedUrl = replaceImageDimensions(decodedUrl, 300, 400);
    console.log(`[PROXY] Processed URL: ${decodedUrl}`);
    
    // Специальные заголовки для обхода блокировок
    const headers: Record<string, string> = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      'Accept': 'image/*',
    };

    // Для picsum.photos добавляем Referer
    if (decodedUrl.includes('picsum.photos')) {
      headers['Referer'] = 'https://picsum.photos/';
    }

    console.log(`[PROXY] Fetching: ${decodedUrl}`);
    const response: Response = await fetch(decodedUrl, { 
      headers,
    });

    if (response.status === 403) {
      console.log(`[PROXY] 403 Forbidden: ${decodedUrl}`);
      return new NextResponse(generatePlaceholder('Blocked'), {
        headers: {
          'Content-Type': 'image/svg+xml',
          'Cache-Control': 'public, max-age=60',
        },
      });
    }
      
    if (!response || !response.ok) {
      throw new Error(`Image fetch failed: ${response?.status || 'no response'}`);
    }

    const contentType = response.headers.get('content-type') || 'image/jpeg';
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    console.log(`[PROXY] Success: ${decodedUrl}`);
    
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
    
  } catch (error) {
    console.error('[PROXY] Error:', error);
    return new NextResponse(generatePlaceholder('Error'), {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=300',
      },
    });
  }
}
