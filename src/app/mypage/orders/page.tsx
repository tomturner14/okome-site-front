"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import RequireLogin from "@/components/RequireLogin/RequireLogin";
import { OrdersResponseSchema, type Order } from "@/types/api";
import styles from "./OrdersPage.module.scss";

export default function OrdersPage() {
  const [items, setItems] = useState<Order[]>([]);
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        setBusy(true);
        const raw = await api<unknown>("/orders", { cache: "no-store", parseErrorJson: true });
        const list = OrdersResponseSchema.parse(raw);
        if (active) setItems(list);
      } catch (e: any) {
        setErr(e?.data?.error ?? e?.message ?? "注文履歴の取得に失敗しました");
      } finally {
        setBusy(false);
      }
    })();
    return () => { active = false; };
  }, []);

  if (busy) {
    return (
      <RequireLogin redirectTo={`/login?next=${encodeURIComponent("/mypage/orders")}`}>
        <main className={styles.page}><p>読み込み中…</p></main>
      </RequireLogin>
    );
  }

  return (
    <RequireLogin redirectTo={`/login?next=${encodeURIComponent("/mypage/orders")}`}>
      <main className={styles.page}>
        <h1 className={styles.title}>注文履歴</h1>

        {err && <p className={styles.error}>{err}</p>}

        {items.length === 0 ? (
          <p className={styles.muted}>まだご注文はありません。</p>
        ) : (
          <ul className={styles.list}>
            {items.map((o) => (
              <li key={o.id} className={styles.card}>
                <div className={styles.header}>
                  <span className={styles.orderId}>注文ID: {o.id}</span>
                  <span className={styles.date}>
                    {new Date(o.ordered_at).toLocaleString()}
                  </span>
                </div>
                <ul className={styles.lines}>
                  {o.items?.map((it, idx) => (
                    <li key={idx} className={styles.line}>
                      <div className={styles.thumb} aria-hidden />
                      <div className={styles.lineMain}>
                        <p className={styles.prod}>{it.title}</p>
                        <p className={styles.qty}>数量: {it.quantity}</p>
                      </div>
                      <div className={styles.price}>¥{it.price.toLocaleString()}</div>
                    </li>
                  ))}
                </ul>
                <div className={styles.footer}>
                  <span className={styles.status}>
                    支払: {o.status} / 発送: {o.fulfill_status}
                  </span>
                  <span className={styles.total}>合計 ¥{o.total_price.toLocaleString()}</span>
                </div>
              </li>
            ))}
          </ul>
        )}

        <p className={styles.back}>
          <Link href="/mypage">マイページに戻る</Link>
        </p>
      </main>
    </RequireLogin>
  );
}
