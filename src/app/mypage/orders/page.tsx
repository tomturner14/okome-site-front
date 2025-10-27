"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import RequireLogin from "@/components/RequireLogin/RequireLogin";
import { api } from "@/lib/api";
import { OrdersResponseSchema, type Order } from "@/types/api";
import styles from "./OrdersPage.module.scss";

export default function OrdersPage() {
  const [items, setItems] = useState<Order[]>([]);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      setBusy(true);
      setErr(null);
      try {
        const raw = await api<unknown>("/orders", { cache: "no-store", parseErrorJson: true });
        const list = OrdersResponseSchema.parse(raw);
        setItems(list);
      } catch (e: any) {
        setErr(e?.data?.error ?? e?.message ?? "注文履歴の取得に失敗しました");
      } finally {
        setBusy(false);
      }
    })();
  }, []);

  return (
    <RequireLogin redirectTo={`/login?next=${encodeURIComponent("/mypage/orders")}`}>
      <main className={styles.page}>
        <h1 className={styles.title}>注文履歴</h1>

        {busy && <p className={styles.muted}>読み込み中...</p>}
        {err && <p className={styles.error}>{err}</p>}

        {items.length === 0 ? (
          <p className={styles.muted}>まだ注文はありません。</p>
        ) : (
          <ul className={styles.list}>
            {items.map((o) => (
              <li key={o.id} className={styles.card}>
                <div className={styles.rowMain}>
                  <p className={styles.orderId}>注文ID: {o.id}</p>
                  <p className={styles.date}>{new Date(o.ordered_at).toLocaleString()}</p>
                  <p className={styles.status}>
                    {o.status} / {o.fulfill_status}
                  </p>
                </div>
                <div className={styles.actions}>
                  <p className={styles.total}>合計: ¥{o.total_price.toLocaleString()}</p>
                  <Link href={`/mypage/orders/${o.id}`} className={styles.link}>
                    詳細を見る
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </main>
    </RequireLogin>
  );
}
