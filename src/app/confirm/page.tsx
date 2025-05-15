'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ConfirmPage() {
  const [info, setInfo] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const data = localStorage.getItem('deliveryInfo');
    if (data) {
      setInfo(JSON.parse(data));
    }
  }, []);

  const handleOrderSubmit = () => {
    // 本来はここでAPIに送信する処理などを挟む
    console.log('注文確定:', info);
    // localStorage など初期化してから遷移しても良い
    router.push('/done');
  };

  if (!info) return <p>読み込み中...</p>;

  return (
    <div style={{ padding: '20px' }}>
      <h2>ご注文内容の確認</h2>
      <p><strong>氏名:</strong> {info.name}</p>
      <p><strong>住所:</strong> {info.address}</p>
      <p><strong>電話番号:</strong> {info.phone}</p>
      <p><strong>メール:</strong> {info.email}</p>

      <div style={{ marginTop: '30px', textAlign: 'right' }}>
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
          注文を確定する
        </button>
      </div>
    </div>
  );
}
