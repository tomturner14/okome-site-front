'use client';

export const dynamic = 'force-dynamic';
import Link from 'next/link';
import styles from './FarmersPage.module.scss';

export default function FarmersPage() {
  return (
    <div className={styles.page}>
      <h1>農家紹介ページ</h1>
      <p className={styles.description}>
        ここでは、酒々井の恵で取り扱っている生産者さんをご紹介します。
        どの生産者さんも安全で美味しいお米作りに情熱を注いでいます。
      </p>
      <div className={styles.actions}>
        <Link href="/" className={styles.backButton}>トップへ戻る</Link>
      </div>
    </div>
  );
}
