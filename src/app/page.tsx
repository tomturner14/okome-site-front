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
        <div className={styles.heroInner}>
          <div className={styles.heroContent}>
            <p className={styles.heroEyebrow}>千葉の田んぼから、毎日の食卓へ</p>

            <h1 className={styles.heroTitle}>
              生産者から直接届く、
              <br />
              まっすぐなお米
            </h1>

            <p className={styles.heroLead}>
              毎日食べるものだからこそ、産地やつくり手が見える形で、
              安心して選べるお米をお届けします。
            </p>

            <div className={styles.heroActions}>
              <Link href="/products" className={styles.primaryButton}>
                商品を見る
              </Link>
              <Link href="/farmers" className={styles.secondaryButton}>
                生産者を見る
              </Link>
            </div>

            <ul className={styles.heroFeatureList}>
              <li className={styles.heroFeaturesItem}>産地がわかる</li>
              <li className={styles.heroFeaturesItem}>つくり手が見える</li>
              <li className={styles.heroFeaturesItem}>毎日選びやすい</li>
            </ul>
          </div>

          <div className={styles.heroVisual}>
            <div className={styles.heroVisualCard}>
              <p className={styles.heroVisualLabel}>About</p>
              <h2 className={styles.heroVisualTitel}>
                つくり手の顔が見える、安心のお米選び
              </h2>
              <p className={styles.heroVisualText}>
                どこで、誰が、どんな思いで育てたのか。
                毎日食べるものだからこそ、背景まで伝わるお米の販売サイトを目指しています。
              </p>

              <div className={styles.heroVisualPoints}>
                <div className={styles.heroVisualPoint}>
                  <span className={styles.heroVisualNumber}>01</span>
                  <span className={styles.heroVisualPointText}>産地がわかる</span>
                </div>
                <div className={styles.heroVisualPoint}>
                  <span className={styles.heroVisualNumber}>02</span>
                  <span className={styles.heroVisualPointText}>つくり手が見える</span>
                </div>
                <div className={styles.heroVisualPoint}>
                  <span className={styles.heroVisualNumber}>03</span>
                  <span className={styles.heroVisualText}>毎日選びやすい</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.products}>
        <div className={styles.sectionHeader}>
          <p className={styles.sectionEyebrow}>Products</p>
          <h2 className={styles.sectionTitle}>人気のお米</h2>
          <p className={styles.sectionLead}>
            毎日の食卓に取り入れやすいお米を、見比べやすい形でご紹介します。
          </p>
        </div>

        <div className={styles.productList}>
          {products.length > 0 ? (
            products.map((product) => (
              <Link
                key={product.id}
                href={`/product/${product.handle}`}
                className={styles.productCard}
              >
                <div className={styles.productImageWrap}>
                  {product.image ? (
                    <Image
                      src={product.image}
                      alt={product.title}
                      width={640}
                      height={480}
                      sizes="(max-width: 640px) 100vw, (max-width: 960px) 50vw, 33vw"
                      className={styles.productImage}
                    />
                  ) : (
                    <div className={styles.productImagePlaceholder}>画像準備中</div>
                  )}
                </div>

                <div className={styles.productBody}>
                  <h3 className={styles.productName}>{product.title}</h3>
                  <p className={styles.productSubText}>商品詳細を見る</p>
                </div>

                <div className={styles.productFooter}>
                  <p className={styles.productPrice}>
                    {Number(product.price).toLocaleString()}円
                  </p>
                  <span className={styles.productLinkText}>詳しく見る</span>
                </div>
              </Link>
            ))
          ) : (
            <div className={styles.emptyState}>
              現在、商品情報を読み込めません。しばらくしてから再度お試しください。
            </div>
          )}
        </div>

        <div className={styles.moreButtonWrap}>
          <Link href="/products" className={styles.moreButton}>
            商品一覧を見る
          </Link>
        </div>
      </section>

      <section className={styles.farmers}>
        <div className={styles.sectionHeader}>
          <p className={styles.sectionEyebrow}>Farmers</p>
          <h2 className={styles.sectionTitle}>生産者と産地を知る</h2>
          <p className={styles.sectionLead}>
            つくり手や地域の背景を知ることが、おいしさや安心感につながります。
          </p>
        </div>

        <div className={styles.farmerList}>
          <Link href="/farmers" className={styles.farmerCard}>
            <p className={styles.farmerCardLabel}>Producer</p>
            <h3 className={styles.farmerCardTitle}>つくり手を知る</h3>
            <p className={styles.farmerCardText}>
              誰が、どんな思いで育てているのかを伝えるための入口です。
            </p>
          </Link>

          <Link href="/farmers" className={styles.farmerCard}>
            <p className={styles.farmerCardLabel}>Area</p>
            <h3 className={styles.farmerCardText}>産地を知る</h3>
            <p className={styles.farmerCardText}>
              土地や気候、地域の魅力まで伝わると、お米の印象もより深まります。
            </p>
          </Link>
        </div>
      </section>
    </>
  );
}