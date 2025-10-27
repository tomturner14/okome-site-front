"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { Order, OrdersResponseSchema } from "@/types/api";
import RequireLogin from "@/components/RequireLogin/RequireLogin";
import styles from "./OrdersPage.module.scss";

export default function OrdersPage() {
  const [items, setItems] = useState<Order[]>([]);
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const raw = await api<unknown>("/orders");
        const list = OrdersResponseSchema.parse(raw);
        setItems(list);
      } catch (e: any) {
        // 未ログインは RequireLogin が処理するのでここでは汎用
        setErr(e?.message ?? "注文履歴の取得に失敗しました");
      } finally {
        setBusy(false);
      }
    })();
  }, []);

  if (busy) return <main className={styles.page}><p>読み込み中...</p></main>;
  if (err) return <main className={styles.page}><p className={styles.error}>{err}</p></main>;

  return (
    <RequireLogin redirectTo={`/login?next=${encodeURIComponent("/mypage/orders")}`}>
      <main className={styles.page}>
        <h1 className={styles.title}>注文履歴</h1>

        {items.length === 0 ? (
          <p className={styles.muted}>まだ注文はありません。</p>
        ) : (
          <ul className={styles.list}>
            {items.map((o) => (
              <li key={o.id} className={styles.card}>
                <div className={styles.header}>
                  <span className={styles.orderId}>注文ID: {o.id}</span>
                  <span className={styles.date}>{new Date(o.ordered_at).toLocaleString()}</span>
                </div>

                <ul className={styles.lines}>
                  {o.items?.map((it, idx) => (
                    <li key={idx} className={styles.line}>
                      <div className={styles.thumb} aria-hidden>
                        {it.image_url ? <img src={it.image_url} alt="" /> : <div className={styles.noimg} />}
                      </div>
                      <div className={styles.lineBody}>
                        <p className={styles.lineTitle}>{it.title}</p>
                        <p className={styles.lineMeta}>
                          数量 {it.quantity} / 単価 {it.price.toLocaleString()} 円
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>

                <div className={styles.footer}>
                  <span className={styles.total}>合計 {o.total_price.toLocaleString()} 円</span>
                  <span className={styles.status}>
                    {o.status}・{o.fulfill_status}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}

        <div className={styles.actions}>
          <Link href="/mypage/addresses" className={styles.secondary}>配送先住所</Link>
          <Link href="/" className={styles.secondary}>トップへ戻る</Link>
        </div>
      </main>
    </RequireLogin>
  );
}
