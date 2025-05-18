import { getProduct } from '@/lib/shopify';
import Image from 'next/image';
import Link from 'next/link';
import AddToCartButton from '@/components/AddToCartButton/AddToCartButton';

type Props = {
  params: { handle: string };
  searchParams?: { [key: string]: string | string[] | undefined };
};

export default async function ProductPage({ params }: Props) {
  const product = await getProduct(params.handle);

  if (!product) {
    return <div>商品が見つかりませんでした。</div>;
  }

  const variant = product.variants?.[0];
  const imageUrl = product.images?.[0]?.src || '';

  return (
    <section style={{ padding: '40px 20px' }}>
      <h2>{product.title}</h2>

      <div style={{ width: '300px', margin: '0 auto' }}>
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={product.title}
            width={300}
            height={200}
            style={{ objectFit: 'cover' }}
          />
        ) : (
          <div style={{
            width: '300px',
            height: '200px',
            backgroundColor: '#eee',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            商品画像
          </div>
        )}
      </div>

      <p style={{ fontSize: '20px', marginTop: '20px' }}>
        価格：{Number(variant?.price.amount || 0).toLocaleString()}円
      </p>

      <div style={{ margin: '20px 0' }}>
        <AddToCartButton
          variantId={variant?.id}
          productTitle={product.title}
        />
      </div>

      <div dangerouslySetInnerHTML={{ __html: product.descriptionHtml || '' }} />

      <div style={{ marginTop: '20px' }}>
        <Link href="/" className="btn-secondary" style={{ marginRight: '10px' }}>
          トップに戻る
        </Link>
      </div>
    </section>
  );
}
