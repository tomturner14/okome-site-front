import Image from 'next/image';
import Link from 'next/link';
import { getProduct } from '@/lib/shopify';
import BuyNowBox from '@/components/BuyNowBox';

type PageProps = { params: Promise<{ handle: string }> };

export default async function ProductPage({ params }: PageProps) {
  const { handle } = await params; // ★ Next.js 15 の推奨形
  const product = await getProduct(handle);

  if (!product) {
    return <div>商品が見つかりませんでした。</div>;
  }

  const firstImage: string | null = product.image ?? null;
  const price: number = Number(product.price ?? 0);
  const firstVariantId: string | null =
    product.variants && product.variants.length > 0
      ? product.variants[0].id ?? null
      : null;

  return (
    <div style={{ padding: '24px 16px', maxWidth: 980, margin: '0 auto' }}>
      <p>
        <Link href="/products">← 戻る</Link>
      </p>

      <h1 style={{ fontSize: 28, margin: '12px 0 20px' }}>{product.title}</h1>

      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: 24 }}>
        <div>
          {firstImage ? (
            <Image
              src={firstImage}
              alt={product.title}
              width={320}
              height={320}
              style={{ objectFit: 'contain' }}
            />
          ) : (
            <div
              style={{
                width: 320,
                height: 320,
                background: '#eee',
                display: 'grid',
                placeItems: 'center',
              }}
            >
              画像なし
            </div>
          )}
        </div>

        <div>
          <p style={{ margin: '8px 0 16px', lineHeight: 1.8 }}>
            {product.description ?? ''}
          </p>
          <p style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 16 }}>
            {price.toLocaleString()}円
          </p>

          {/* ここで BuyNowBox に “最初のバリアントID” を渡す */}
          <BuyNowBox variantId={firstVariantId} />

          {/* あとで通常の「カートに入れる」などを足してOK */}
        </div>
      </div>
    </div>
  );
}
