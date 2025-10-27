"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import RequireLogin from "@/components/RequireLogin/RequireLogin";
import { api } from "@/lib/api";
import { OrderSchema, type Order } from "@/types/api";
import styles from "./OrdersDetailPage.module.scss";

export default function OrderDetailPage() {
  const params = useParams<{ id: string }>();
  const id = Number(params?.id);

  const [data, setData] = useState<Order | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (!Number.isFinite(id)) {
      setErr("不正なIDです");
      return;
    }
    (async () => {
      setBusy(true);
      setErr(null);
      try {
        const raw = await api<unknown>(`/orders/${id}`, {
          cache: "no-store",
          parseErrorJson: true,
        });
        const order = OrderSchema.parse(raw);
        setData(order);
      } catch (e: any) {
        setErr(e?.data?.error ?? e?.message ?? "注文詳細の取得に失敗しました");
      } finally {
        setBusy(false);
      }
    })();
  }, [id]);

  return (
    <RequireLogin redirectTo={`/login?next=${encodeURIComponent(`/mypage/orders/${id}`)}`}>
      <main className={styles.page}>
        <h1 className={styles.title}>注文詳細</h1>

        {busy && <p className={styles.muted}>読み込み中...</p>}
        {err && <p className={styles.error}>{err}</p>}

        {data && (
          <section className={styles.card}>
            <div className={styles.meta}>
              <p>注文ID: {data.id}</p>
              <p>注文日時: {new Date(data.ordered_at).toLocaleString()}</p>
              <p>注文ステータス: {data.status}</p>
              <p>発送ステータス: {data.fulfill_status}</p>
              <p className={styles.total}>合計: ¥{data.total_price.toLocaleString()}</p>
            </div>

            <h2 className={styles.sectionTitle}>明細</h2>
            {data.items?.length ? (
              <ul className={styles.items}>
                {data.items.map((it, idx) => (
                  <li key={idx} className={styles.item}>
                    {it.image_url && <img src={it.image_url} alt="" className={styles.thumb} />}
                    <div className={styles.line}>
                      <p className={styles.name}>{it.title}</p>
                      <p className={styles.sub}>数量: {it.quantity} / 単価: ¥{it.price.toLocaleString()}</p>
                    </div>
                    <p className={styles.lineTotal}>
                      ¥{(it.price * it.quantity).toLocaleString()}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className={styles.muted}>明細がありません。</p>
            )}
          </section>
        )}

        <p className={styles.back}>
          <Link href="/mypage/orders">注文履歴に戻る</Link>
        </p>
      </main>
    </RequireLogin>
  );
}
