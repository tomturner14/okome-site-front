'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  createCart, 
  getCart, 
  addToCart as addItemToCart, 
  removeFromCart, 
  updateCartItem 
} from '@/lib/shopify';

type ShopifyCartContextType = {
  cart: any;
  loading: boolean;
  addToCart: (variantId: string, quantity?: number) => Promise<void>;
  removeItem: (lineItemId: string) => Promise<void>;
  updateItem: (lineItemId: string, quantity: number) => Promise<void>;
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
};

const ShopifyCartContext = createContext<ShopifyCartContextType | undefined>(undefined);

export function ShopifyCartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<any>(null);
  const [checkoutId, setCheckoutId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);

  // カートの初期化
  useEffect(() => {
    async function initializeCart() {
      try {
        // ローカルストレージからチェックアウトIDを取得
        const existingCheckoutId = localStorage.getItem('shopifyCheckoutId');
        
        if (existingCheckoutId) {
          // 既存のカートを取得
          const existingCart = await getCart(existingCheckoutId);
          
          // カートが有効かチェック（期限切れなどで無効な場合は新しいカートを作成）
          if (existingCart && !existingCart.completedAt) {
            setCart(existingCart);
            setCheckoutId(existingCheckoutId);
            setLoading(false);
            return;
          }
        }
        
        // 新しいカートを作成
        const newCart = await createCart();
        if (newCart) {
          localStorage.setItem('shopifyCheckoutId', newCart.id);
          setCart(newCart);
          setCheckoutId(newCart.id);
        }
        setLoading(false);
      } catch (error) {
        console.error('カートの初期化中にエラーが発生しました:', error);
        setLoading(false);
      }
    }
    
    initializeCart();
  }, []);

  // カートに商品を追加
  const addToCart = async (variantId: string, quantity: number = 1) => {
    if (!checkoutId) return;
    
    setLoading(true);
    try {
      const updatedCart = await addItemToCart(checkoutId, variantId, quantity);
      if (updatedCart) {
        setCart(updatedCart);
        setIsCartOpen(true);
      }
    } catch (error) {
      console.error('カートへの商品追加に失敗しました:', error);
    } finally {
      setLoading(false);
    }
  };

  // カートから商品を削除
  const removeItem = async (lineItemId: string) => {
    if (!checkoutId) return;
    
    setLoading(true);
    try {
      const updatedCart = await removeFromCart(checkoutId, [lineItemId]);
      if (updatedCart) {
        setCart(updatedCart);
      }
    } catch (error) {
      console.error('カートからの商品削除に失敗しました:', error);
    } finally {
      setLoading(false);
    }
  };

  // カート内の商品数量を更新
  const updateItem = async (lineItemId: string, quantity: number) => {
    if (!checkoutId) return;
    
    setLoading(true);
    try {
      const updatedCart = await updateCartItem(checkoutId, lineItemId, quantity);
      if (updatedCart) {
        setCart(updatedCart);
      }
    } catch (error) {
      console.error('カート内商品の更新に失敗しました:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ShopifyCartContext.Provider 
      value={{ 
        cart, 
        loading, 
        addToCart, 
        removeItem, 
        updateItem,
        isCartOpen,
        setIsCartOpen
      }}
    >
      {children}
    </ShopifyCartContext.Provider>
  );
}

export function useShopifyCart() {
  const context = useContext(ShopifyCartContext);
  if (context === undefined) {
    throw new Error('useShopifyCart must be used within a ShopifyCartProvider');
  }
  return context;
}