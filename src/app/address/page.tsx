import Link from 'next/link';
import styles from './AddressPage.module.scss';

export default function AddressPage() {
  return (
    <div className={styles.form}>
      <h2>お届け先情報の入力</h2>
      <form action="/confirm" method="POST">
        <div className={styles.field}>
          <label>
            氏名: 
            <input type="text" name="name" required />
          </label>
        </div>
        <div className={styles.field}>
          <label>
            住所: 
            <input type="text" name="address" required />
          </label>
        </div>
        <div className={styles.field}>
          <label>
            電話番号: 
            <input type="tel" name="phone" required />
          </label>
        </div>
        <div className={styles.field}>
          <label>
            メールアドレス: 
            <input type="email" name="email" required />
          </label>
        </div>
        <div>
          <button type="submit" className={styles.submitButton}>お届け先の登録</button>
        </div>
      </form>
      <div className={styles.cartActions}>
        <Link href="/confirm" className={styles.submitButton}>確認画面へ進む</Link>
      </div>
    </div>
  );
}
