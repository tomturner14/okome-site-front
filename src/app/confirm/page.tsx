"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import styles from "./ConfirmPage.module.scss";

/**
 * Shopify からの戻りを受ける簡易確認ページ。
 * - 受け取りうるクエリ例:
 *   ?order_number=1234 / ?order_id=999 / ?name=#1234 / ?shopify_order_id=xxxx
 * - ここではバックエンド照会は行わず、注文番号などを表示して
 *   「マイページの注文履歴をご確認ください」に誘導する最小実装。
 */
export default function ConfirmPage() {
  const sp = useSearchParams();

  const orderNumber =
    sp.get("order_number") ||
    sp.get("name") ||
    sp.get("order") ||
    sp.get("orderName") ||
    "";

  const orderId =
    sp.get("order_id") ||
    sp.get("id") ||
    sp.get("shopify_order_id") ||
    "";

  return (
    <main className={styles.page}>
      <h1 className={styles.title}>決済の確認中です</h1>

      <p className={styles.lead}>
        決済・在庫の確認が完了すると、注文履歴に反映されます。
      </p>

      {(orderNumber || orderId) && (
        <div className={styles.info}>
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

      <p className={styles.help}>
        反映まで数分かかる場合があります。反映されない場合は、
        少し時間をおいてから再度お試しください。
      </p>
    </main>
  );
}
