'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useShopifyCart } from '@/context/ShopifyCartContext';

export default function ConfirmPage() {
  const [info, setInfo] = useState<any>(null);
  const { checkoutId, getCart } = useShopifyCart();
  const router = useRouter();

  useEffect(() => {
    const data = localStorage.getItem('deliveryInfo');
    if (data) {
      setInfo(JSON.parse(data));
    }
  }, []);

  const handleOrderSubmit = async () => {
    if (!checkoutId) {
      alert('カートが見つかりません。');
      return;
    }

    try {
      const cart = await getCart(checkoutId);
      const checkoutUrl = cart?.webUrl;

      if (checkoutUrl) {
        // 本番ではここで注文情報と一緒に送信処理なども入れる
        console.log('注文情報:', info);
        window.location.href = checkoutUrl; // Shopifyの支払い画面へ遷移
      } else {
        alert('支払い画面の取得に失敗しました。');
      }
    } catch (error) {
      console.error('checkoutへの遷移中にエラー:', error);
      alert('注文処理に失敗しました。');
    }
  };

  if (!info) return <p>読み込み中...</p>;

  return (
    <div style={{ padding: '20px' }}>
      <h2>ご注文内容の確認</h2>
      <p><strong>氏名:</strong> {info.name}</p>
      <p><strong>住所:</strong> {info.address}</p>
      <p><strong>電話番号:</strong> {info.phone}</p>
      <p><strong>メール:</strong> {info.email}</p>

      <div style={{ marginTop: '30px', textAlign: 'left' }}>
        <button
          onClick={handleOrderSubmit}
          style={{
            backgroundColor: '#319304',
            color: 'white',
            padding: '12px 24px',
            fontSize: '16px',
            borderRadius: '6px',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          注文を確定する（決済画面へ）
        </button>
      </div>
    </div>
  );
}
