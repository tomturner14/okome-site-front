import Link from 'next/link';

export default function ConfirmPage() {
  return (
    <div style={{ padding: '0 20px' }}>
      <h2>ご注文内容の確認</h2>

      <section className="confirm-section">
        <h3>ご注文商品</h3>
        <div className="confirm-item">
          <div className="product-image" style={{ width: '150px', height: '150px', backgroundColor: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            お米の画像
          </div>
          <div>
            <p><strong>商品名:</strong> 千葉県産コシヒカリ</p>
            <p><strong>数量:</strong> 1袋</p>
            <p><strong>合計金額:</strong> 4,000円（税込）</p>
          </div>
        </div>
      </section>

      <section className="confirm-section">
        <h3>お届け先</h3>
        <p><strong>お名前:</strong> 田中 太郎</p>
        <p><strong>住所:</strong> 千葉県印旛郡酒々井町123-4</p>
        <p><strong>電話番号:</strong> 090-1234-5678</p>
      </section>

      <div className="cart-actions">
        <Link href="/done" className="next-button">注文確定</Link>
      </div>
    </div>
  );
}