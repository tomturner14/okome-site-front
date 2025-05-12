import Link from 'next/link';

export default function CartPage() {
  return (
    <div style={{ padding: '0 20px' }}>
      <h2>カートの中身</h2>
      <div className="cart-item">
        <div className="product-image" style={{ width: '150px', height: '150px', backgroundColor: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          お米の画像
        </div>
        <div className="item-info">
          <p><strong>千葉県産コシヒカリ</strong></p>
          <p>数量: 1</p>
          <p>価格: 4,000円</p>
          <p><strong>合計: 4,000円</strong></p>
        </div>
      </div>

      <div className="cart-actions">
        <Link href="/address" className="next-button">購入手続きへ</Link>
      </div>
    </div>
  );
}