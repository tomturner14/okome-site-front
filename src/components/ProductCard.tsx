import Link from 'next/link';
import { Product } from '@/types/product';

type ProductCardProps = {
  product: Product;
};

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Link href={`/product/${product.id}`} className="product-card">
      <div className="product-image">
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
      </div>
      <h3 className="product-name">{product.name}</h3>
      <p className="product-price">{product.price.toLocaleString()}円 ({product.weight})</p>
    </Link>
  );
}