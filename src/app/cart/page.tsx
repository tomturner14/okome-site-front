import Link from 'next/link';
import styles from './CartPage.module.scss';

export default function CartPage() {
  return (
    <div style={{ padding: '0 20px' }}>
      <h2>カートの中身</h2>
      <div className={styles.cartItem}>
        <div className={styles.productImage}>
          お米の画像
        </div>
        <div className={styles.itemInfo}>
          <p><strong>千葉県産コシヒカリ</strong></p>
          <p>数量: 1</p>
          <p>価格: 4,000円</p>
          <p><strong>合計: 4,000円</strong></p>
        </div>
      </div>

      <div className={styles.cartActions}>
        <Link href="/address" className={styles.nextButton}>購入手続きへ</Link>
      </div>
    </div>
  );
}
