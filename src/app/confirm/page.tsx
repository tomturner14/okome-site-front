import Link from 'next/link';
import styles from './ConfirmPage.module.scss';

export default function ConfirmPage() {
  return (
    <div style={{ padding: '0 20px' }}>
      <h2>ご注文内容の確認</h2>

      <section className={styles.confirmSection}>
        <h3>ご注文商品</h3>
        <div className={styles.confirmItem}>
          <div className={styles.productImage}>
            お米の画像
          </div>
          <div>
            <p><strong>商品名:</strong> 千葉県産コシヒカリ</p>
            <p><strong>数量:</strong> 1袋</p>
            <p><strong>合計金額:</strong> 4,000円（税込）</p>
          </div>
        </div>
      </section>

      <section className={styles.confirmSection}>
        <h3>お届け先</h3>
        <p><strong>お名前:</strong> 田中 太郎</p>
        <p><strong>住所:</strong> 千葉県印旛郡酒々井町123-4</p>
        <p><strong>電話番号:</strong> 090-1234-5678</p>
      </section>

      <div className={styles.cartActions}>
        <Link href="/done" className={styles.nextButton}>注文確定</Link>
      </div>
    </div>
  );
}
