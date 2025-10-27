"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import {
  MeResponseSchema,
  type MeResponse,
} from "@/types/api";
import {
  OrdersResponseSchema,
  type Order,
} from "@/types/api";
import styles from "./MyPage.module.scss";

export default function MyPage() {
  const router = useRouter();
  const [me, setMe] = useState<MeResponse | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(true);

  useEffect(() => {
    let active = true;

    (async () => {
      try {
        // 1) セッション確認
        const meRaw = await api<unknown>("/me", { parseErrorJson: true });
        const meParsed = MeResponseSchema.parse(meRaw);
        if (!meParsed.loggedIn || !meParsed.user) {
          router.replace(`/login?next=/mypage`);
          return;
        }
        if (!active) return;
        setMe(meParsed);

        // 2) 注文履歴取得
        const raw = await api<unknown>(`/users/${meParsed.user.id}/orders`, {
          parseErrorJson: true,
        });
        const list = OrdersResponseSchema.parse(raw);
        if (!active) return;
        setOrders(list);
      } catch (e: any) {
        setErr(e?.data?.error ?? e?.message ?? "読み込みに失敗しました");
      } finally {
        if (active) setBusy(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [router]);

  if (busy) return <main className={styles.page}>読み込み中...</main>;
  if (err) return <main className={styles.page}><p className={styles.error}>{err}</p></main>;
  if (!me?.user) return null; // 直前でリダイレクト済み

  return (
    <main className={styles.page}>
      <h1 className={styles.title}>マイページ</h1>

      <section className={styles.section}>
        <h2 className={styles.h2}>アカウント</h2>
        <div className={styles.card}>
          <p className={styles.row}><span className={styles.key}>お名前</span><span className={styles.val}>{me.user.name}</span></p>
          <p className={styles.row}><span className={styles.key}>メール</span><span className={styles.val}>{me.user.email}</span></p>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.h2}>注文履歴</h2>

        {orders.length === 0 ? (
          <p className={styles.muted}>注文履歴はまだありません。</p>
        ) : (
          <ul className={styles.orderList}>
            {orders.map((o) => (
              <li key={o.id} className={styles.orderItem}>
                <div className={styles.orderHead}>
                  <span className={styles.orderId}># {o.id}</span>
                  <span className={styles.orderDate}>
                    {new Date(o.ordered_at).toLocaleString()}
                  </span>
                </div>

                <div className={styles.orderMeta}>
                  <span>合計: {o.total_price.toLocaleString()} 円</span>
                  <span>支払: {o.status}</span>
                  <span>発送: {o.fulfill_status}</span>
                </div>

                {o.items.length > 0 && (
                  <ul className={styles.itemList}>
                    {o.items.map((it, idx) => (
                      <li key={idx} className={styles.itemRow}>
                        <div className={styles.itemThumb} aria-hidden>
                          {it.image_url ? <img src={it.image_url} alt="" /> : <div className={styles.noThumb} />}
                        </div>
                        <div className={styles.itemBody}>
                          <p className={styles.itemTitle}>{it.title}</p>
                          <p className={styles.itemSub}>
                            {it.quantity} 点 × {it.price.toLocaleString()} 円
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
