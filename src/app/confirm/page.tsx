"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "./ConfirmPage.module.scss";

// 余計な注入を避ける軽いサニタイズ
function safePath(p: string | null): string {
  if (!p) return "/";
  if (p.startsWith("http://") || p.startsWith("https://") || p.startsWith("//")) return "/";
  if (!p.startsWith("/")) return "/";
  return p;
}

export default function ConfirmPage() {
  const router = useRouter();
  const sp = useSearchParams();

  // 可能なら注文ID/番号を引き継いで /done に遷移
  useEffect(() => {
    const timer = setTimeout(() => {
      const orderId = sp.get("id");
      const orderNumber = sp.get("order_number");
      const status = sp.get("status"); // 任意: 決済側から渡ってくることがある
      const next = "/done" + buildQuery({ id: orderId, order_number: orderNumber, status });
      router.replace(safePath(next));
    }, 2000); // 2秒待ってから遷移（ユーザーが読める猶予）
    return () => clearTimeout(timer);
  }, [router, sp]);

  const id = sp.get("id");
  const orderNumber = sp.get("order_number");
  const next = "/done" + buildQuery({ id, order_number: orderNumber });

  return (
    <main className={styles.page}>
      <h1 className={styles.title}>決済を確認しています…</h1>
      <p className={styles.muted}>このままお待ちください。自動で注文完了画面に移動します。</p>

      <div className={styles.box}>
        {orderNumber && <p>注文番号: <strong>{orderNumber}</strong></p>}
        {id && <p>内部ID: <strong>#{id}</strong></p>}
      </div>

      <p className={styles.actions}>
        <Link className={styles.link} href={safePath(next)}>移動しない場合はこちらをクリック</Link>
      </p>
    </main>
  );
}

function buildQuery(q: Record<string, string | null>): string {
  const s = new URLSearchParams();
  Object.entries(q).forEach(([k, v]) => { if (v) s.set(k, v); });
  const str = s.toString();
  return str ? `?${str}` : "";
}
