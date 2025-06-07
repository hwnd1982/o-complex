import { NextResponse, NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  console.log(request.url);
  return NextResponse.next()
}