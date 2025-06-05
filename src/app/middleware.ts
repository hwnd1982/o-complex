import { NextResponse, NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Пока ничего не делаем
  console.log(request.url);
  return NextResponse.next()
}