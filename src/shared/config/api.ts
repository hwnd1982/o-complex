export const API_URL = 'http://o-complex.com:1337';
export const LOCAL_URL = process.env.NODE_ENV === 'production'
  ? `https://${process.env.VERCEL_URL}/api`
  : 'http://localhost:3000/api';
export const PAGE_SIZE = 6;

