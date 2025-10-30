"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import {
  MeResponseSchema,
  type MeResponse,
  OrdersResponseSchema,
  type Order,
} from "@/types/api";
import { formatDateTime, formatPrice } from "@/lib/format";
import styles from "./MyPage.module.scss";

function getErrMessage(e: any, fallback: string) {
  if (e?.status === 401) return "ログインが必要です。";
  if (e?.status === 403) return "権限がありません。";
  return e?.data?.message ?? e?.message ?? fallback;
}

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

        // 2) 注文履歴（プレビュー用に取得）
        const raw = await api<unknown>("/orders", { parseErrorJson: true });
        const list = OrdersResponseSchema.parse(raw);
        if (!active) return;
        setOrders(list);
      } catch (e: any) {
        setErr(getErrMessage(e, "読み込みに失敗しました"));
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
  if (!me?.user) return null;

  return (
    <main className={styles.page}>
      <h1 className={styles.title}>マイページ</h1>

      {/* アカウント */}
      <section className={styles.section}>
        <h2 className={styles.h2}>アカウント</h2>
        <div className={styles.card}>
          <p className={styles.row}>
            <span className={styles.key}>お名前</span>
            <span className={styles.val}>{me.user.name}</span>
          </p>
          <p className={styles.row}>
            <span className={styles.key}>メール</span>
            <span className={styles.val}>{me.user.email}</span>
          </p>
        </div>

        {/* 住所編集への導線（常時表示） */}
        <p style={{ marginTop: 12 }}>
          <Link href="/mypage/addresses">配送先住所を管理する</Link>
        </p>
      </section>

      {/* 注文履歴（プレビュー） */}
      <section className={styles.section}>
        <h2 className={styles.h2}>注文履歴</h2>
        {/* 一覧ページへの導線を常時表示 */}
        <p style={{ margin: "6px 0 12px" }}>
          <Link href="/mypage/orders">注文履歴一覧へ</Link>
        </p>

        {orders.length === 0 ? (
          <p className={styles.muted}>注文履歴はまだありません。</p>
        ) : (
          <ul className={styles.orderList}>
            {orders.slice(0, 3).map((o) => (
              <li key={o.id} className={styles.orderItem}>
                <div className={styles.orderHead}>
                  <span className={styles.orderId}># {o.id}</span>
                  <span className={styles.orderDate}>
                    {formatDateTime(o.ordered_at)}
                  </span>
                </div>

                <div className={styles.orderMeta}>
                  <span>合計: {formatPrice(o.total_price)}</span>
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
                            {it.quantity} 点 × {formatPrice(it.price)}
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
