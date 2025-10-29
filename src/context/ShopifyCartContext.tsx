'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

type Cart = { id: string; webUrl?: string; lineItems: any[] };

type CartCtx = {
  checkoutId: string | null;
  loading: boolean;
  // ダミー実装（ネットワークなし）
  getCart: (id: string) => Promise<Cart | null>;
  createCart: () => Promise<Cart>;
  addItem: (variantId: string, quantity: number) => Promise<void>;
  removeItem: (lineItemId: string) => Promise<void>;
  updateCartItem: (lineItemId: string, quantity: number) => Promise<void>;
};

const Ctx = createContext<CartCtx>({
  checkoutId: null,
  loading: false,
  getCart: async (id: string) => ({ id, lineItems: [] }),
  createCart: async () => ({ id: '', lineItems: [] }),
  addItem: async () => { },
  removeItem: async () => { },
  updateCartItem: async () => { },
});

export const ShopifyCartProvider = ({ children }: { children: React.ReactNode }) => {
  const [checkoutId, setCheckoutId] = useState<string | null>(null);
  const [loading] = useState(false);

  const getCart = useCallback(async (id: string) => {
    // ここでは空カートを返すだけ
    return { id, lineItems: [] };
  }, []);

  const createCart = useCallback(async () => {
    const id = (globalThis.crypto?.randomUUID?.() ?? String(Date.now()));
    setCheckoutId(id);
    return { id, lineItems: [] };
  }, []);

  const addItem = useCallback(async () => { }, []);
  const removeItem = useCallback(async () => { }, []);
  const updateCartItem = useCallback(async () => { }, []);

  const value = useMemo(
    () => ({ checkoutId, loading, getCart, createCart, addItem, removeItem, updateCartItem }),
    [checkoutId, loading, getCart, createCart, addItem, removeItem, updateCartItem]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
};

export const useShopifyCart = () => useContext(Ctx);
