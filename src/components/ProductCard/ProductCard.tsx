import Link from 'next/link';
import { Product } from '@/types/product';
import styles from './ProductCard.module.scss';

type ProductCardProps = {
  product: Product;
};

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Link href={`/product/${product.id}`} className={styles.productCard}>
      <div className={styles.productImage}>
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
      <h3 className={styles.productName}>{product.name}</h3>
      <p className={styles.productPrice}>{product.price.toLocaleString()}円 ({product.weight})</p>
    </Link>
  );
}
