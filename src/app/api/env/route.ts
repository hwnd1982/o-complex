import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    VERCEL_URL: process.env.VERCEL_URL,
    BASE_URL: process.env.BASE_URL,
    NODE_ENV: process.env.NODE_ENV,
  });
}