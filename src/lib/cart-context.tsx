"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type CartLine = { productId: string; size: string; qty: number };

type CartContextValue = {
  items: CartLine[];
  count: number;
  loaded: boolean;
  addToCart: (productId: string, size: string, qty?: number) => void;
  updateQty: (index: number, qty: number) => void;
  removeFromCart: (index: number) => void;
  clearCart: () => void;
};

const STORAGE_KEY = "tt_cart";
const CartContext = createContext<CartContextValue | null>(null);

function readCart(): CartLine[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartLine[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setItems(readCart());
    setLoaded(true);
    const onStorage = () => setItems(readCart());
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const persist = useCallback((next: CartLine[]) => {
    setItems(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // storage unavailable — cart still works for this render
    }
  }, []);

  const addToCart = useCallback(
    (productId: string, size: string, qty = 1) => {
      const idx = items.findIndex((i) => i.productId === productId && i.size === size);
      const next =
        idx > -1
          ? items.map((line, i) => (i === idx ? { ...line, qty: line.qty + qty } : line))
          : [...items, { productId, size, qty }];
      persist(next);
    },
    [items, persist],
  );

  const updateQty = useCallback(
    (index: number, qty: number) => {
      const next =
        qty <= 0 ? items.filter((_, i) => i !== index) : items.map((line, i) => (i === index ? { ...line, qty } : line));
      persist(next);
    },
    [items, persist],
  );

  const removeFromCart = useCallback(
    (index: number) => {
      persist(items.filter((_, i) => i !== index));
    },
    [items, persist],
  );

  const clearCart = useCallback(() => persist([]), [persist]);

  const count = useMemo(() => items.reduce((s, i) => s + i.qty, 0), [items]);

  const value = useMemo(
    () => ({ items, count, loaded, addToCart, updateQty, removeFromCart, clearCart }),
    [items, count, loaded, addToCart, updateQty, removeFromCart, clearCart],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
