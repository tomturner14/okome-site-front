import Link from 'next/link';
import styles from './PaymentReportPage.module.scss';

export default function PaymentReportPage() {
  return (
    <div className={styles.wrapper}>
      <h2>振込完了報告フォーム</h2>
      <form action="#" method="post" className={styles.form}>
        <div className={styles.field}>
          <label>
            注文番号：
            <input type="text" name="orderId" required />
          </label>
        </div>
        <div className={styles.field}>
          <label>
            登録メールアドレス：
            <input type="email" name="email" required />
          </label>
        </div>
        <div className={styles.field}>
          <label>
            振込名義人：
            <input type="text" name="name" required />
          </label>
        </div>
        <div className={styles.field}>
          <label>
            振込日：
            <input type="date" name="date" required />
          </label>
        </div>
        <div className={styles.field}>
          <label>
            振込金額：
            <input type="number" name="amount" required /> 円
          </label>
        </div>
        <div style={{ textAlign: 'center' }}>
          <button type="submit" className={styles.submitButton}>振込完了報告を送信</button>
        </div>
      </form>
      <div className={styles.linkArea}>
        <Link href="/" className={styles.linkButton}>トップページに戻る</Link>
      </div>
    </div>
  );
}
