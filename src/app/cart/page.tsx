'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useShopifyCart } from '@/context/ShopifyCartContext';
import styles from './CartPage.module.scss';

export default function CartPage() {
  const { getCart, checkoutId, loading, removeItem } = useShopifyCart();
  const [lineItems, setLineItems] = useState<any[]>([]);

  useEffect(() => {
    const fetchCart = async () => {
      if (checkoutId) {
        const cart = await getCart(checkoutId);
        if (cart && cart.lineItems) {
          setLineItems(cart.lineItems);
        }
      }
    };
    fetchCart();
  }, [checkoutId]);

  const handleRemove = async (lineItemId: string) => {
    await removeItem(lineItemId);
    if (checkoutId) {
      const updatedCart = await getCart(checkoutId);
      if (updatedCart?.lineItems) {
        setLineItems(updatedCart.lineItems);
      }
    }
  };

  const total = lineItems.reduce((sum, item) => {
    return sum + parseFloat(item.variant.price.amount) * item.quantity;
  }, 0);

  if (loading) return <p>読み込み中...</p>;

  return (
    <div className={styles.wrapper}>
      <h2>カートの中身</h2>

      {lineItems.length === 0 ? (
        <p>カートに商品がありません。</p>
      ) : (
        <>
          {lineItems.map(item => (
            <div key={item.id} className={styles.cartItem}>
              <div className={styles.productImage}>
                {item.variant.image ? (
                  <Image
                    src={item.variant.image.src}
                    alt={item.title}
                    width={100}
                    height={100}
                  />
                ) : (
                  '画像なし'
                )}
              </div>
              <div className={styles.itemInfo}>
                <p><strong>{item.title}</strong></p>
                <p>数量: {item.quantity}</p>
                <p>価格: {parseFloat(item.variant.price.amount).toLocaleString()}円</p>
                <button
                  onClick={() => handleRemove(item.id)}
                  className={styles.removeButton}
                >
                  削除
                </button>
              </div>
            </div>
          ))}

          <div className={styles.totalArea}>
            <p><strong>合計: {total.toLocaleString()}円</strong></p>
          </div>

          <div className={styles.cartActions}>
            <Link href="/address" className={styles.nextButton}>購入手続きへ</Link>
          </div>
        </>
      )}
    </div>
  );
}
