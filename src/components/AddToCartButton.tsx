'use client';
import { useState } from 'react';
import { useShopifyCart } from '@/context/ShopifyCartContext';

type AddToCartButtonProps = {
  variantId: string;
  productTitle: string;
};

export default function AddToCartButton({ variantId, productTitle }: AddToCartButtonProps) {
  const { addToCart, loading } = useShopifyCart();
  const [isAdded, setIsAdded] = useState(false);
  
  const handleAddToCart = async () => {
    await addToCart(variantId);
    setIsAdded(true);
    
    // 3秒後にメッセージをリセット
    setTimeout(() => {
      setIsAdded(false);
    }, 3000);
  };
  
  return (
    <button 
      onClick={handleAddToCart} 
      className="add-cart-button"
      disabled={loading || isAdded}
    >
      {loading ? 'カートに追加中...' : isAdded ? `${productTitle}をカートに追加しました！` : 'カートに追加'}
    </button>
  );
}