import { API_URL, PAGE_SIZE } from '@/shared/config';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = searchParams.get('page') || '1';
  const pageSize = searchParams.get('page_size') || `${PAGE_SIZE}`;

  try {
    const response = await fetch(
      `${API_URL}/products?page=${page}&page_size=${pageSize}`,
      { headers: { 
        'Content-Type': 'application/json',
      }}
    );
    
    if (!response.ok) throw new Error(`API status ${response.status}`);
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: { ...(typeof error === "object" ? error : {}), message: 'Failed to fetch products'} },
      { status: 500 }
    );
  }
}