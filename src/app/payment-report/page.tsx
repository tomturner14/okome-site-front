"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import styles from "./PaymentReportPage.module.scss";

function asBool(v: string | null): boolean | null {
  if (v === null) return null;
  if (v === "1" || v === "true" || v === "ok" || v === "success") return true;
  if (v === "0" || v === "false" || v === "ng" || v === "fail" || v === "failed") return false;
  return null;
}

export default function PaymentReportPage() {
  const sp = useSearchParams();

  // 受け取り想定の例:
  // /payment-report?ok=1&order_number=12345&id=99&reason=auth_declined
  const ok = asBool(sp.get("ok"));
  const status = sp.get("status");
  const reason = sp.get("reason");
  const orderNumber = sp.get("order_number");
  const id = sp.get("id");

  const success = ok === true || status === "paid" || status === "success";

  return (
    <main className={styles.page}>
      <h1 className={styles.title}>支払いレポート</h1>

      {success ? (
        <>
          <p className={styles.good}>決済が正常に完了しました。</p>
          <div className={styles.info}>
            {orderNumber && <p>注文番号: <strong>{orderNumber}</strong></p>}
            {id && <p>内部ID: <strong>#{id}</strong></p>}
          </div>
          <div className={styles.actions}>
            <Link className={styles.primary} href={"/done" + buildQuery({ id, order_number: orderNumber, status: "paid" })}>
              注文完了へ
            </Link>
            <Link className={styles.secondary} href="/">トップへ戻る</Link>
          </div>
        </>
      ) : (
        <>
          <p className={styles.bad}>決済が完了しませんでした。</p>
          {reason && <p className={styles.muted}>理由: {reason}</p>}
          <div className={styles.actions}>
            <Link className={styles.primary} href="/cart">カートへ戻る</Link>
            <Link className={styles.secondary} href="/">トップへ戻る</Link>
          </div>
        </>
      )}
    </main>
  );
}

function buildQuery(q: Record<string, string | null>): string {
  const s = new URLSearchParams();
  Object.entries(q).forEach(([k, v]) => { if (v) s.set(k, v); });
  const str = s.toString();
  return str ? `?${str}` : "";
}
