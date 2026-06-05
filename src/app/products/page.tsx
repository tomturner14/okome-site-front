export const dynamic = 'force-dynamic';

import Link from 'next/link';
import Image from 'next/image';
import { getProducts } from '@/lib/shopify';
import type { ProductListItem } from '@/types/api';
import styles from '../HomePage.module.scss';

type ProductsPageProps = {
  searchParams?: Promise<{
    q?: string | string[];
  }>;
};

const formatPrice = (price: number | string) =>
  `${Number(price).toLocaleString('ja-JP')}円`;

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  let products: ProductListItem[] = [];

  // 自分で打つ：URLの ?q=... を受け取る部分
  const params = await searchParams;
  const rawQuery = params?.q;
  const query = Array.isArray(rawQuery) ? rawQuery[0] ?? '' : rawQuery ?? '';
  const normalizedQuery = query.trim().toLowerCase();

  try {
    products = await getProducts();
  } catch (error) {
    console.error('商品一覧の取得に失敗:', error);
    products = [];
  }

  // 自分で打つ：検索語があるときだけ、商品名とhandleで絞り込む部分
  const filteredProducts = normalizedQuery
    ? products.filter((product) => {
      const searchableText = `${product.title} ${product.handle}`.toLowerCase();
      return searchableText.includes(normalizedQuery);
    })
    : products;

  return (
    <section className={styles.products}>
      <div className={styles.sectionHeader}>
        <p className={styles.sectionEyebrow}>商品一覧</p>
        <h1 className={styles.sectionTitle}>
          {normalizedQuery ? '検索結果' : 'お米を選ぶ'}
        </h1>
        <p className={styles.sectionLead}>
          {normalizedQuery
            ? `「${query}」に一致する商品を表示しています。`
            : '写真・商品名・価格から気になる商品を見つけて、そのまま詳細ページへ進めます。'}
        </p>
      </div>

      <div className={styles.productList}>
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
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
                <h2 className={styles.productName}>{product.title}</h2>
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
            {normalizedQuery
              ? '条件に一致する商品が見つかりませんでした。検索語を変えて再度お試しください。'
              : '現在、商品情報を読み込めません。しばらくしてから再度お試しください。'}
          </div>
        )}
      </div>
    </section>
  );
}
