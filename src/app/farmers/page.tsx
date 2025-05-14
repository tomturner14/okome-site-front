import Link from 'next/link';
import styles from './FarmersPage.module.scss';

export default function FarmersPage() {
  return (
    <div className={styles.wrapper}>
      <h1>農家紹介ページ</h1>
      <p>
        ここでは、おこめ販売で取り扱っている農家さんをご紹介します。
        どの農家さんも安全で美味しいお米作りに情熱を注いでいます。
      </p>
      <div className={styles.linkArea}>
        <Link href="/" className={styles.nextButton}>トップへ戻る</Link>
      </div>
    </div>
  );
}
