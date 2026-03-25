export const dynamic = 'force-dynamic';

import Link from 'next/link';
import Image from 'next/image';
import { getProducts } from '@/lib/shopify';
import styles from './HomePage.module.scss';

type Product = {
  id: string;
  handle: string;
  title: string;
  image: string | null;
  price: number | string;
};

export default async function Home() {
  let products: Product[] = [];

  try {
    products = await getProducts();
    console.log('取得した商品一覧:', products);
  } catch (error) {
    console.error('ホーム商品の取得に失敗:', error);
    products = [];
  }

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
          {products.length > 0 ? (
            products.map((product) => (
              <Link
                key={product.id}
                href={`/product/${product.handle}`}
                className="product-card"
              >
                <div className="product-image">
                  {product.image ? (
                    <Image
                      src={product.image}
                      alt={product.title}
                      width={220}
                      height={150}
                      style={{ objectFit: 'cover' }}
                    />
                  ) : (
                    <div
                      style={{
                        width: '100%',
                        height: '100%',
                        backgroundColor: '#eee',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      画像なし
                    </div>
                  )}
                </div>
                <h3 className="product-name">{product.title}</h3>
                <p className="product-price">
                  {Number(product.price).toLocaleString()}円
                </p>
              </Link>
            ))
          ) : (
            <div
              style={{
                width: '100%',
                padding: '24px',
                textAlign: 'center',
                color: '#666',
              }}
            >
              現在、商品情報を読み込めません。しばらくしてから再度お試しください。
            </div>
          )}
        </div>

        <Link href="/products" className={styles.moreButton}>
          もっと見る
        </Link>
      </section>

      <section className={styles.farmers}>
        <h2>生産者紹介</h2>
        <div className={styles.farmerList}>
          <Link href="/farmers" className={styles.farmerCard}>
            農家紹介1
          </Link>
          <Link href="/farmers" className={styles.farmerCard}>
            農家紹介2
          </Link>
        </div>
      </section>
    </>
  );
}