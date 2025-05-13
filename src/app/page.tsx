import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import { products } from '@/data/products';

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
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
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