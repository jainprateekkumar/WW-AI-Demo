import type { Product } from '../types';

export class ApiError extends Error {
  constructor(message: string, public status: number) {
    super(message);
  }
}

async function getJson<T>(url: string): Promise<T> {
  let res: Response;
  try {
    res = await fetch(url);
  } catch {
    throw new ApiError('Network error', 0);
  }
  if (!res.ok) {
    let message = 'Request failed';
    try {
      message = (await res.json()).error?.message ?? message;
    } catch {
      /* ignore */
    }
    throw new ApiError(message, res.status);
  }
  return (await res.json()) as T;
}

export const fetchProducts = (): Promise<Product[]> => getJson('/api/products');
export const fetchProduct = (id: string): Promise<Product> =>
  getJson(`/api/products/${encodeURIComponent(id)}`);
