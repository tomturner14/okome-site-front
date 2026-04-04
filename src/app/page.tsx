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

const formatPrice = (price: number | string) =>
  `${Number(price).toLocaleString('ja-JP')}円`;

export default async function Home() {
  let products: Product[] = [];

  try {
    products = await getProducts();
  } catch (error) {
    console.error('ホーム商品の取得に失敗:', error);
    products = [];
  }

  return (
    <>
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.heroContent}>
            <p className={styles.heroEyebrow}>
              千葉の農産物を、きちんと選べるかたちで
            </p>

            <h1 className={styles.heroTitle}>
              毎日の食卓に合うお米を、
              <br />
              産地とつくり手から選ぶ
            </h1>

            <p className={styles.heroLead}>
              毎日食べるものだから、派手な見せ方よりも、選びやすさと信頼感を大切に。
              商品情報と生産者の背景をあわせて見ながら、納得して選べる販売サイトを目指しています。
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
              <li className={styles.heroFeaturesItem}>商品を見比べやすい</li>
              <li className={styles.heroFeaturesItem}>つくり手の背景がわかる</li>
              <li className={styles.heroFeaturesItem}>日々の買い物に使いやすい</li>
            </ul>
          </div>

          <div className={styles.heroVisual}>
            <div className={styles.heroVisualCard}>
              <p className={styles.heroVisualLabel}>はじめての方へ</p>

              <h2 className={styles.heroVisualTitle}>
                トップページから、
                <br />
                商品と生産者の両方をたどれる構成にしています
              </h2>

              <p className={styles.heroVisualText}>
                気になる商品を見つけて詳細を見る。
                その後に、生産者や産地の情報も確認する。
                農産物ECとして自然に回遊できる入口になるよう、必要な導線だけを整理しています。
              </p>

              <div className={styles.heroVisualPoints}>
                <div className={styles.heroVisualPoint}>
                  <span className={styles.heroVisualNumber}>01</span>
                  <span className={styles.heroVisualPointText}>
                    商品一覧から、気になるお米を探す
                  </span>
                </div>

                <div className={styles.heroVisualPoint}>
                  <span className={styles.heroVisualNumber}>02</span>
                  <span className={styles.heroVisualPointText}>
                    商品詳細で、価格や内容を確認する
                  </span>
                </div>

                <div className={styles.heroVisualPoint}>
                  <span className={styles.heroVisualNumber}>03</span>
                  <span className={styles.heroVisualPointText}>
                    生産者ページで、つくり手や地域の背景を知る
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.products}>
        <div className={styles.sectionHeader}>
          <p className={styles.sectionEyebrow}>商品一覧</p>
          <h2 className={styles.sectionTitle}>お米を選ぶ</h2>
          <p className={styles.sectionLead}>
            写真・商品名・価格から気になる商品を見つけて、そのまま詳細ページへ進めます。
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
                  <p className={styles.productCategory}>お米</p>
                  <h3 className={styles.productName}>{product.title}</h3>
                  <p className={styles.productSubText}>商品詳細・内容を確認する</p>
                </div>

                <div className={styles.productFooter}>
                  <p className={styles.productPrice}>{formatPrice(product.price)}</p>
                  <span className={styles.productLinkText}>詳細を見る</span>
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
          <p className={styles.sectionEyebrow}>生産者紹介</p>
          <h2 className={styles.sectionTitle}>つくり手と産地を知る</h2>
          <p className={styles.sectionLead}>
            どんな人が、どんな土地で育てているのか。味だけでなく背景もあわせて伝える入口です。
          </p>
        </div>

        <div className={styles.farmerList}>
          <Link href="/farmers" className={styles.farmerCard}>
            <p className={styles.farmerCardLabel}>生産者</p>
            <h3 className={styles.farmerCardTitle}>つくり手の考え方を見る</h3>
            <p className={styles.farmerCardText}>
              毎日の管理や栽培への向き合い方が伝わると、商品選びにも納得感が出ます。
            </p>
            <span className={styles.farmerCardLink}>生産者ページへ</span>
          </Link>

          <Link href="/farmers" className={styles.farmerCard}>
            <p className={styles.farmerCardLabel}>産地</p>
            <h3 className={styles.farmerCardTitle}>地域のことを知る</h3>
            <p className={styles.farmerCardText}>
              土地や気候の背景まで知ることで、農産物を選ぶ時間そのものが自然になります。
            </p>
            <span className={styles.farmerCardLink}>産地紹介へ</span>
          </Link>
        </div>
      </section>
    </>
  );
}