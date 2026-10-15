import { createContext, useContext, useEffect, useMemo, useReducer } from 'react';
import type { ReactNode } from 'react';
import type { CartLine } from '../types';
import {
  STORAGE_KEY,
  cartReducer,
  itemCount,
  parseStoredCart,
  subtotalPaise,
} from './cartLogic';
import type { CartAction } from './cartLogic';

interface CartContextValue {
  lines: CartLine[];
  itemCount: number;
  subtotalPaise: number;
  dispatch: (a: CartAction) => void;
}

const CartContext = createContext<CartContextValue | null>(null);

function load(): CartLine[] {
  try {
    return parseStoredCart(localStorage.getItem(STORAGE_KEY));
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, dispatch] = useReducer(cartReducer, undefined, load);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: 1, lines }));
    } catch {
      /* ignore write failures */
    }
  }, [lines]);

  const value = useMemo(
    () => ({ lines, itemCount: itemCount(lines), subtotalPaise: subtotalPaise(lines), dispatch }),
    [lines],
  );
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
