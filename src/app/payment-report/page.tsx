"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import styles from "./PaymentReportPage.module.scss";

/**
 * 決済レポート結果の受け口（成功/失敗/キャンセル等）。
 * 受け取り想定のクエリ:
 * - status: "success" | "pending" | "failed" | "canceled"
 * - code: エラーコード等
 * - msg: メッセージ
 * - order_number / order_id: 注文識別情報
 */
export default function PaymentReportPage() {
  const sp = useSearchParams();

  const status = (sp.get("status") || "").toLowerCase();
  const code = sp.get("code") || "";
  const msg = sp.get("msg") || "";
  const orderNumber =
    sp.get("order_number") ||
    sp.get("name") ||
    sp.get("order") ||
    "";
  const orderId = sp.get("order_id") || sp.get("id") || "";

  const titleByStatus: Record<string, string> = {
    success: "お支払いが完了しました",
    pending: "お支払いを確認しています",
    failed: "お支払いエラーが発生しました",
    canceled: "お支払いがキャンセルされました",
  };

  const descByStatus: Record<string, string> = {
    success: "注文履歴に反映されます。詳細は注文履歴をご確認ください。",
    pending: "反映まで時間がかかる場合があります。後ほど注文履歴をご確認ください。",
    failed: "恐れ入りますが、別の決済手段で再度お試しください。",
    canceled: "決済は実行されていません。再度のご注文をご検討ください。",
  };

  const title = titleByStatus[status] || "支払いレポート";
  const desc = descByStatus[status] || "決済処理の結果を表示しています。";

  return (
    <main className={styles.page}>
      <h1 className={styles.title}>{title}</h1>
      <p className={styles.lead}>{desc}</p>

      {(orderNumber || orderId) && (
        <div className={styles.box}>
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

      {(code || msg) && (
        <div className={styles.box}>
          {code && (
            <p className={styles.row}>
              <span className={styles.key}>コード</span>
              <span className={styles.val}>{code}</span>
            </p>
          )}
          {msg && (
            <p className={styles.row}>
              <span className={styles.key}>メッセージ</span>
              <span className={styles.val}>{msg}</span>
            </p>
          )}
        </div>
      )}

      <div className={styles.actions}>
        <Link href="/mypage/orders" className={styles.primary}>
          注文履歴へ
        </Link>
        <Link href="/" className={styles.secondary}>
          トップへ戻る
        </Link>
      </div>
    </main>
  );
}
