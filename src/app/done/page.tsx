"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import styles from "./DonePage.module.scss";

export default function DonePage() {
  const sp = useSearchParams();
  const id = sp.get("id");
  const orderNumber = sp.get("order_number");
  const status = sp.get("status"); // 例: "paid" / "pending" / "cancelled" などが来る場合あり

  return (
    <main className={styles.page}>
      <h1 className={styles.title}>ご注文ありがとうございます！</h1>
      <p className={styles.lead}>注文が完了しました。確認メールをお送りしています。</p>

      <section className={styles.info}>
        {orderNumber && (
          <p className={styles.row}>
            <span className={styles.key}>注文番号</span>
            <span className={styles.val}>{orderNumber}</span>
          </p>
        )}
        {id && (
          <p className={styles.row}>
            <span className={styles.key}>内部ID</span>
            <span className={styles.val}>#{id}</span>
          </p>
        )}
        {status && (
          <p className={styles.row}>
            <span className={styles.key}>ステータス</span>
            <span className={styles.val}>{status}</span>
          </p>
        )}
      </section>

      <div className={styles.actions}>
        {id ? (
          <Link className={styles.primary} href={`/mypage/orders/${encodeURIComponent(id)}`}>
            注文詳細を見る
          </Link>
        ) : (
          <Link className={styles.primary} href="/mypage/orders">
            注文履歴へ
          </Link>
        )}
        <Link className={styles.secondary} href="/">トップへ戻る</Link>
      </div>
    </main>
  );
}
