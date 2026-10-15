import { describe, expect, it } from 'vitest';
import {
  cartReducer,
  itemCount,
  parseStoredCart,
  subtotalPaise,
} from '../src/cart/cartLogic';
import type { CartLine, Product } from '../src/types';

const p: Product = { id: 'a', name: 'A', description: '', price: 10.1, imageUrl: '' };

describe('cartReducer', () => {
  it('adds new then increments duplicates', () => {
    let s = cartReducer([], { type: 'ADD', product: p });
    s = cartReducer(s, { type: 'ADD', product: p });
    expect(s).toHaveLength(1);
    expect(s[0].quantity).toBe(2);
  });

  it('caps quantity at 10', () => {
    let s: CartLine[] = [];
    for (let i = 0; i < 15; i++) s = cartReducer(s, { type: 'ADD', product: p });
    expect(s[0].quantity).toBe(10);
    s = cartReducer(s, { type: 'INCREMENT', id: 'a' });
    expect(s[0].quantity).toBe(10);
  });

  it('removes line when decrementing from 1', () => {
    const s = cartReducer(cartReducer([], { type: 'ADD', product: p }), { type: 'DECREMENT', id: 'a' });
    expect(s).toEqual([]);
  });

  it('computes totals in paise', () => {
    let s: CartLine[] = [];
    for (let i = 0; i < 3; i++) s = cartReducer(s, { type: 'ADD', product: p });
    expect(itemCount(s)).toBe(3);
    expect(subtotalPaise(s)).toBe(3030);
  });
});

describe('parseStoredCart', () => {
  it('discards corrupt data', () => {
    expect(parseStoredCart('{bad')).toEqual([]);
    expect(parseStoredCart(null)).toEqual([]);
    expect(parseStoredCart(JSON.stringify({ version: 2, lines: [] }))).toEqual([]);
  });

  it('drops invalid lines, clamps quantity and dedupes', () => {
    const good = { productId: 'a', name: 'A', price: 5, imageUrl: '', quantity: 99 };
    const raw = JSON.stringify({
      version: 1,
      lines: [good, { ...good, quantity: 2 }, { productId: 1 }, null],
    });
    const out = parseStoredCart(raw);
    expect(out).toHaveLength(1);
    expect(out[0].quantity).toBe(10);
  });
});
