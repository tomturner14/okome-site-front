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
import { toUserMessage } from "@/lib/errorMessage";
import styles from "./MyPage.module.scss";

export default function MyPage() {
  const router = useRouter();
  const [me, setMe] = useState<MeResponse | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(true);
  const [claimMsg, setClaimMsg] = useState<string | null>(null);
  const [claimBusy, setClaimBusy] = useState(false);

  async function fetchAll(activeRef: { v: boolean }) {
    const meRaw = await api<unknown>("/me", { parseErrorJson: true });
    const meParsed = MeResponseSchema.parse(meRaw);
    if (!meParsed.loggedIn || !meParsed.user) {
      router.replace(`/login?next=/mypage`);
      return;
    }
    if (!activeRef.v) return;
    setMe(meParsed);

    const raw = await api<unknown>("/orders", { parseErrorJson: true });
    const list = OrdersResponseSchema.parse(raw);
    if (!activeRef.v) return;
    setOrders(list);
  }

  useEffect(() => {
    let active = { v: true };
    (async () => {
      try {
        await fetchAll(active);
      } catch (e: any) {
        setErr(toUserMessage(e, "読み込みに失敗しました。"));
      } finally {
        if (active.v) setBusy(false);
      }
    })();
    return () => { active.v = false; };
  }, [router]);

  async function onClaim() {
    setClaimMsg(null);
    setClaimBusy(true);
    try {
      const resp = await api<{ ok: boolean; claimed: number }>("/orders/claim", {
        method: "POST",
        parseErrorJson: true,
      });
      setClaimMsg(resp.ok ? `未ひも付け注文を ${resp.claimed} 件、あなたのアカウントに紐付けました。` : "引き取りに失敗しました。");
      await fetchAll({ v: true });
    } catch (e: any) {
      setClaimMsg(toUserMessage(e, "引き取りに失敗しました。"));
    } finally {
      setClaimBusy(false);
    }
  }

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

        <p style={{ marginTop: 12 }}>
          <Link href="/mypage/addresses">配送先住所を管理する</Link>
        </p>

        {/* 未ひも付け注文の引き取り */}
        <div style={{ marginTop: 12, display: "flex", gap: 8, alignItems: "center" }}>
          <button
            type="button"
            className={styles.secondary}
            onClick={onClaim}
            disabled={claimBusy}
            title="メール一致の未ひも付け注文を、あなたのアカウントに紐付けます"
          >
            {claimBusy ? "引き取り中…" : "未ひも付け注文を引き取る"}
          </button>
          {claimMsg && <span className={styles.muted}>{claimMsg}</span>}
        </div>
      </section>

      {/* 注文履歴（プレビュー） */}
      <section className={styles.section}>
        <h2 className={styles.h2}>注文履歴</h2>
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
                  <span className={styles.orderDate}>{formatDateTime(o.ordered_at)}</span>
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
                          <p className={styles.itemSub}>{it.quantity} 点 × {formatPrice(it.price)}</p>
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
