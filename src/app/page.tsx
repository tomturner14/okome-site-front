import Link from 'next/link';

export default function Home() {
  return (
    <>
      <section className="hero">
        <h2>生産者から直接届くおいしいお米</h2>
        <p>安心・安全・新鮮なお米をあなたに。</p>
        <div className="hero-image">写真エリア</div>
      </section>

      <section className="products">
        <h2>人気のお米</h2>
        <div className="product-list">
          <Link href="/product" className="product-card">
            <div className="product-image">
              <div style={{ width: '100%', height: '100%', backgroundColor: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                お米の画像
              </div>
            </div>
            <h3 className="product-name">千葉県産コシヒカリ</h3>
            <p className="product-price">4,000円 (5kg)</p>
          </Link>
          
          <Link href="/product" className="product-card">
            <div className="product-image">
              <div style={{ width: '100%', height: '100%', backgroundColor: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                お米の画像
              </div>
            </div>
            <h3 className="product-name">千葉県産ふさおとめ</h3>
            <p className="product-price">3,800円 (5kg)</p>
          </Link>
          
          <Link href="/product" className="product-card">
            <div className="product-image">
              <div style={{ width: '100%', height: '100%', backgroundColor: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                お米の画像
              </div>
            </div>
            <h3 className="product-name">千葉県産ゆめぴりか</h3>
            <p className="product-price">3,900円 (5kg)</p>
          </Link>
        </div>
        <Link href="/products" className="more-button">もっと見る</Link>
      </section>

      <section className="farmers">
        <h2>生産者紹介</h2>
        <div className="farmer-list">
          <Link href="/farmers" className="farmer-card">農家紹介1</Link>
          <Link href="/farmers" className="farmer-card">農家紹介2</Link>
        </div>
      </section>
    </>
  );
}