import type { CartLine, Product } from '../types';

export const MAX_QTY = 10;
export const STORAGE_KEY = 'cart.v1';

export type CartAction =
  | { type: 'ADD'; product: Product }
  | { type: 'INCREMENT'; id: string }
  | { type: 'DECREMENT'; id: string }
  | { type: 'REMOVE'; id: string }
  | { type: 'CLEAR' }
  | { type: 'HYDRATE'; lines: CartLine[] };

export function cartReducer(lines: CartLine[], action: CartAction): CartLine[] {
  switch (action.type) {
    case 'ADD': {
      const p = action.product;
      if (lines.some((l) => l.productId === p.id)) {
        return lines.map((l) =>
          l.productId === p.id ? { ...l, quantity: Math.min(l.quantity + 1, MAX_QTY) } : l,
        );
      }
      return [
        ...lines,
        { productId: p.id, name: p.name, price: p.price, imageUrl: p.imageUrl, quantity: 1 },
      ];
    }
    case 'INCREMENT':
      return lines.map((l) =>
        l.productId === action.id ? { ...l, quantity: Math.min(l.quantity + 1, MAX_QTY) } : l,
      );
    case 'DECREMENT':
      return lines.flatMap((l) => {
        if (l.productId !== action.id) return [l];
        return l.quantity > 1 ? [{ ...l, quantity: l.quantity - 1 }] : [];
      });
    case 'REMOVE':
      return lines.filter((l) => l.productId !== action.id);
    case 'CLEAR':
      return [];
    case 'HYDRATE':
      return action.lines;
  }
}

export const itemCount = (lines: CartLine[]): number => lines.reduce((s, l) => s + l.quantity, 0);
export const lineTotalPaise = (l: CartLine): number => Math.round(l.price * 100) * l.quantity;
export const subtotalPaise = (lines: CartLine[]): number =>
  lines.reduce((s, l) => s + lineTotalPaise(l), 0);

function isValidLine(x: unknown): x is CartLine {
  if (typeof x !== 'object' || x === null) return false;
  const l = x as Record<string, unknown>;
  return (
    typeof l.productId === 'string' &&
    l.productId !== '' &&
    typeof l.name === 'string' &&
    typeof l.price === 'number' &&
    Number.isFinite(l.price) &&
    l.price >= 0 &&
    typeof l.imageUrl === 'string' &&
    typeof l.quantity === 'number' &&
    Number.isFinite(l.quantity)
  );
}

/** Parse stored cart JSON; any failure yields an empty cart. */
export function parseStoredCart(raw: string | null): CartLine[] {
  if (!raw) return [];
  try {
    const data = JSON.parse(raw);
    if (!data || data.version !== 1 || !Array.isArray(data.lines)) return [];
    const seen = new Set<string>();
    const out: CartLine[] = [];
    for (const item of data.lines) {
      if (!isValidLine(item) || seen.has(item.productId)) continue;
      seen.add(item.productId);
      const quantity = Math.min(MAX_QTY, Math.max(1, Math.round(item.quantity)));
      out.push({ ...item, quantity });
    }
    return out;
  } catch {
    return [];
  }
}
