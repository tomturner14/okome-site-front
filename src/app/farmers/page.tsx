'use client';
import Link from 'next/link';
import styles from './FarmersPage.module.scss';

export default function FarmersPage() {
  return (
    <div className={styles.page}>
      <h1>農家紹介ページ</h1>
      <p className={styles.description}>
        ここでは、おこめ販売で取り扱っている農家さんをご紹介します。
        どの農家さんも安全で美味しいお米作りに情熱を注いでいます。
      </p>
      <div className={styles.actions}>
        <Link href="/" className={styles.backButton}>トップへ戻る</Link>
      </div>
    </div>
  );
}
