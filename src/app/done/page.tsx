"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import styles from "./DonePage.module.scss";

/**
 * 決済完了（Thank you）後に戻ってくる想定の完了ページ。
 * 最小表示：お礼メッセージ＋注文番号（あれば）＋遷移リンク。
 */
export default function DonePage() {
  const sp = useSearchParams();
  const orderNumber =
    sp.get("order_number") ||
    sp.get("name") ||
    sp.get("order") ||
    sp.get("orderName") ||
    "";
  const orderId = sp.get("order_id") || sp.get("id") || "";

  return (
    <main className={styles.page}>
      <h1 className={styles.title}>ご注文ありがとうございました</h1>
      <p className={styles.lead}>
        ご注文内容は「注文履歴」からいつでもご確認いただけます。
        確認メールも送信されますのでご確認ください。
      </p>

      {(orderNumber || orderId) && (
        <div className={styles.summary}>
          {orderNumber && (
            <p className={styles.row}>
              <span className={styles.key}>注文番号</span>
              <span className={styles.val}>{orderNumber}</span>
            </p>
          )}
          {orderId && (
            <p className={styles.row}>
              <span className={styles.key}>注文ID</span>
              <span className={styles.val}>{orderId}</span>
            </p>
          )}
        </div>
      )}

      <div className={styles.actions}>
        <Link href="/mypage/orders" className={styles.primary}>
          注文履歴を開く
        </Link>
        <Link href="/" className={styles.secondary}>
          トップへ戻る
        </Link>
      </div>
    </main>
  );
}
