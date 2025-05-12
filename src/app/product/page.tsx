import Link from 'next/link';

export default function ProductPage() {
  return (
    <section className="product-detail">
      <h2>千葉県産コシヒカリ</h2>
      <div className="product-image" style={{ width: '300px', height: '200px', margin: '0 auto', backgroundColor: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        お米の画像
      </div>
      <p className="product-price">価格：4,000円 (5kg)</p>
      <p>おいしい千葉のお米です。ふっくらツヤツヤ。</p>
      <form action="/cart" method="get">
        <button type="submit" className="add-cart-button">カートに追加</button>
      </form>
    </section>
  );
}