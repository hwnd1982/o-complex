export const API_URL = 'http://o-complex.com:1337';
export const LOCAL_URL = process.env.NODE_ENV === "production"
  ? `https://o-complex-pi.vercel.app/api` 
  : 'http://localhost:3000/api';
export const PAGE_SIZE = 6;

export const API_TIMEOUT = 8000;
export const MAX_RETRIES = 3;
export const INITIAL_RETRY_DELAY = 1000;
export const MAX_PARALLEL_REQUESTS = 6;