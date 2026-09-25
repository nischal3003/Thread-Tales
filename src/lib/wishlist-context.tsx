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

type WishlistContextValue = {
  ids: string[];
  count: number;
  loaded: boolean;
  isSaved: (productId: string) => boolean;
  toggle: (productId: string) => void;
  remove: (productId: string) => void;
};

const STORAGE_KEY = "tt_wishlist";
const WishlistContext = createContext<WishlistContextValue | null>(null);

function readWishlist(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [ids, setIds] = useState<string[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setIds(readWishlist());
    setLoaded(true);
    const onStorage = () => setIds(readWishlist());
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const persist = useCallback((next: string[]) => {
    setIds(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // storage unavailable — wishlist still works for this render
    }
  }, []);

  const toggle = useCallback(
    (productId: string) => {
      const next = ids.includes(productId) ? ids.filter((id) => id !== productId) : [...ids, productId];
      persist(next);
    },
    [ids, persist],
  );

  const remove = useCallback(
    (productId: string) => {
      persist(ids.filter((id) => id !== productId));
    },
    [ids, persist],
  );

  const isSaved = useCallback((productId: string) => ids.includes(productId), [ids]);

  const value = useMemo(
    () => ({ ids, count: ids.length, loaded, isSaved, toggle, remove }),
    [ids, loaded, isSaved, toggle, remove],
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
}
