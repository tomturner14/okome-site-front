import Link from 'next/link';
import Image from 'next/image';
import { getProducts } from '@/lib/shopify';
import styles from './HomePage.module.scss';

export default async function Home() {
  const products = await getProducts();

  return (
    <>
      <section className={styles.hero}>
        <h2>生産者から直接届くおいしいお米</h2>
        <p>安心・安全・新鮮なお米をあなたに。</p>
        <div className={styles.heroImage}>写真エリア</div>
      </section>

      <section className={styles.products}>
        <h2>人気のお米</h2>
        <div className={styles.productList}>
          {products.map((product: any) => (
            <Link href={`/product/${product.handle}`} className="product-card" key={product.id}>
              <div className="product-image">
                {product.images && product.images.length > 0 ? (
                  <Image
                    src={product.images[0].src}
                    alt={product.title}
                    width={220}
                    height={150}
                    style={{ objectFit: 'cover' }}
                  />
                ) : (
                  <div style={{
                    width: '100%',
                    height: '100%',
                    backgroundColor: '#eee',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    お米の画像
                  </div>
                )}
              </div>
              <h3 className="product-name">{product.title}</h3>
              <p className="product-price">
                {Number(product.variants[0].price).toLocaleString()}円
              </p>
            </Link>
          ))}
        </div>
        <Link href="/products" className={styles.moreButton}>もっと見る</Link>
      </section>

      <section className={styles.farmers}>
        <h2>生産者紹介</h2>
        <div className={styles.farmerList}>
          <Link href="/farmers" className={styles.farmerCard}>農家紹介1</Link>
          <Link href="/farmers" className={styles.farmerCard}>農家紹介2</Link>
        </div>
      </section>
    </>
  );
}
