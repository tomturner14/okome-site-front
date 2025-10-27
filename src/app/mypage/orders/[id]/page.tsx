"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";
import RequireLogin from "@/components/RequireLogin/RequireLogin";
import { OrderDetailSchema, type OrderDetail } from "@/types/api";
import styles from "./OrderDetailPage.module.scss";

export default function OrderDetailPage() {
  const params = useParams<{ id: string }>();
  const [data, setData] = useState<OrderDetail | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(true);

  const id = Number(params?.id);

  useEffect(() => {
    let active = true;

    (async () => {
      if (!Number.isFinite(id)) {
        setErr("不正な注文IDです");
        setBusy(false);
        return;
      }
      try {
        const raw = await api<unknown>(`/orders/${id}`, {
          cache: "no-store",
          parseErrorJson: true,
        });
        const parsed = OrderDetailSchema.parse(raw);
        if (active) setData(parsed);
      } catch (e: any) {
        const msg = e?.data?.error ?? e?.message ?? "注文情報の取得に失敗しました";
        if (active) setErr(msg);
      } finally {
        if (active) setBusy(false);
      }
    })();

    return () => { active = false; };
  }, [id]);

  return (
    <RequireLogin redirectTo={`/login?next=${encodeURIComponent(`/mypage/orders/${isNaN(id) ? "" : id}`)}`}>
      <main className={styles.page}>
        <h1 className={styles.title}>注文詳細</h1>

        {busy && <p>読み込み中…</p>}
        {err && <p className={styles.error}>{err}</p>}

        {!busy && !err && data && (
          <article className={styles.card}>
            <header className={styles.header}>
              <div className={styles.row}>
                <span className={styles.key}>注文ID</span>
                <span className={styles.val}>#{data.id}</span>
              </div>
              <div className={styles.row}>
                <span className={styles.key}>注文日時</span>
                <span className={styles.val}>{new Date(data.ordered_at).toLocaleString()}</span>
              </div>
              <div className={styles.row}>
                <span className={styles.key}>ステータス</span>
                <span className={styles.val}>{data.status} / {data.fulfill_status}</span>
              </div>
              <div className={styles.row}>
                <span className={styles.key}>合計</span>
                <span className={styles.val}>¥{data.total_price.toLocaleString()}</span>
              </div>
            </header>

            {data.address && (
              <section className={styles.section}>
                <h2 className={styles.h2}>配送先</h2>
                <div className={styles.box}>
                  <p className={styles.addrName}>{data.address.recipient_name}</p>
                  <p>〒{data.address.postal_code}</p>
                  <p>{data.address.address_1}{data.address.address_2 ? ` ${data.address.address_2}` : ""}</p>
                  <p>{data.address.phone}</p>
                </div>
              </section>
            )}

            <section className={styles.section}>
              <h2 className={styles.h2}>注文明細</h2>
              {data.items.length === 0 ? (
                <p className={styles.muted}>品目がありません。</p>
              ) : (
                <ul className={styles.lines}>
                  {data.items.map((it, idx) => (
                    <li key={idx} className={styles.line}>
                      <div className={styles.thumb} aria-hidden>
                        {it.image_url ? <img src={it.image_url} alt="" /> : <div className={styles.noimg} />}
                      </div>
                      <div className={styles.lineBody}>
                        <p className={styles.prod}>{it.title}</p>
                        <p className={styles.meta}>数量 {it.quantity} / 単価 ¥{it.price.toLocaleString()}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </article>
        )}

        <p className={styles.actions}>
          <Link href="/mypage/orders" className={styles.secondary}>注文一覧に戻る</Link>
          <Link href="/" className={styles.secondary}>トップへ戻る</Link>
        </p>
      </main>
    </RequireLogin>
  );
}
