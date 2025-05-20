import Link from 'next/link';
import styles from './RegisterPage.module.scss';

export default function RegisterPage() {
  return (
    <div className={styles.form}>
      <h1>新規登録ページ</h1>
      <form>
        <div className={styles.field}>
          <label>
            お名前:
            <input type="text" name="name" required />
          </label>
        </div>
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
        <div className={styles.field}>
          <label>
            パスワード（確認）:
            <input type="password" name="passwordConfirm" required />
          </label>
        </div>
        <div>
          <button type="submit" className={styles.submitButton}>登録する</button>
        </div>
      </form>
      <div className={styles.linkArea}>
        <p>すでにアカウントをお持ちの方は<Link href="/login" className={styles.linkGreen}>こちら</Link>からログインできます。</p>
        <Link href="/" className={styles.submitButton}>トップへ戻る</Link>
      </div>
    </div>
  );
}
