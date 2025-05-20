import Link from 'next/link';
import styles from './LoginPage.module.scss';

export default function LoginPage() {
  return (
    <div className={styles.form}>
      <h1>ログインページ</h1>
      <form>
        <div className={styles.field}>
          <label>
            メールアドレス:
            <input type="email" name="email" required />
          </label>
        </div>
        <div className={styles.field}>
          <label>
            パスワード:
            <input type="password" name="password" required />
          </label>
        </div>
        <div>
          <button type="submit" className={styles.submitButton}>ログイン</button>
        </div>
      </form>
      <div className={styles.linkArea}>
        <p>アカウントをお持ちでない方は<Link href="/register" className={styles.linkGreen}>こちら</Link>から登録できます。</p>
        <Link href="/" className={styles.submitButton}>トップへ戻る</Link>
      </div>
    </div>
  );
}
