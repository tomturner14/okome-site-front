import Link from 'next/link';
import Image from 'next/image';
import { getProduct } from '@/lib/shopify';
import { notFound } from 'next/navigation';
import AddToCartButton from '@/components/AddToCartButton/AddToCartButton';

type Props = {
  params: { handle: string };
};

export default async function ProductPage({ params }: Props) {
  const { handle } = params;
  const product = await getProduct(handle);
  
  if (!product) {
    notFound();
  }

  const variant = product.variants[0];
  const imageUrl = product.images && product.images.length > 0 ? product.images[0].src : '';
  
  return (
    <section className="product-detail">
      <h2>{product.title}</h2>

      <div className="product-image-container" style={{ width: '300px', margin: '0 auto' }}>
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

      <p className="product-price">価格：{Number(variant.price).toLocaleString()}円</p>
      <div dangerouslySetInnerHTML={{ __html: product.descriptionHtml || '' }} />

      <div style={{ margin: '20px 0' }}>
        <AddToCartButton 
          variantId={variant.id} 
          productTitle={product.title}
        />
      </div>

      <div style={{ marginTop: '20px' }}>
        <Link href="/" className="btn-secondary" style={{ marginRight: '10px' }}>トップに戻る</Link>
      </div>
    </section>
  );
}
