"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import RequireLogin from "@/components/RequireLogin/RequireLogin";
import { api } from "@/lib/api";
import { Address, AddressesResponseSchema } from "@/types/api";
import styles from "./CheckoutPage.module.scss";

function formatPostal7(pc: string) {
  return pc?.length === 7 ? `${pc.slice(0, 3)}-${pc.slice(3)}` : pc;
}

export default function CheckoutPage() {
  const router = useRouter();
  const [list, setList] = useState<Address[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [busy, setBusy] = useState(true);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  // 初期ロード
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const raw = await api<unknown>("/addresses", { cache: "no-store", parseErrorJson: true });
        const data = AddressesResponseSchema.parse(raw);
        if (!active) return;
        setList(data);

        const def = data.find((a) => a.is_default);
        const pick = def?.id ?? data[0]?.id ?? null;
        setSelectedId(pick);
        if (pick) localStorage.setItem("checkout_address_id", String(pick));
      } catch (e: any) {
        setErr(e?.data?.error ?? e?.message ?? "配送先の取得に失敗しました");
      } finally {
        if (active) setBusy(false);
      }
    })();
    return () => { active = false; };
  }, []);

  async function onChangeSelect(id: number) {
    setSelectedId(id);
    localStorage.setItem("checkout_address_id", String(id));
    setSaving(true);
    setErr(null);
    try {
      // 既定に設定 → 以降の画面や次回アクセスでも自動選択される
      const updated = await api<unknown>(`/addresses/${id}/default`, {
        method: "PUT",
        parseErrorJson: true,
      });
      // 楽観的に list を更新
      setList((prev) =>
        prev.map((a) => ({ ...a, is_default: a.id === id }))
      );
    } catch (e: any) {
      setErr(e?.data?.error ?? e?.message ?? "既定の設定に失敗しました");
    } finally {
      setSaving(false);
    }
  }

  function onContinue() {
    // 本番ではここで Shopify Checkout の作成→リダイレクト等を行う。
    // このステップでは確認画面に繋ぐ。
    router.push("/confirm");
  }

  if (busy) {
    return (
      <RequireLogin redirectTo={`/login?next=${encodeURIComponent("/checkout")}`}>
        <main className={styles.page}><p>読み込み中…</p></main>
      </RequireLogin>
    );
  }

  if (list.length === 0) {
    return (
      <RequireLogin redirectTo={`/login?next=${encodeURIComponent("/checkout")}`}>
        <main className={styles.page}>
          <h1 className={styles.title}>チェックアウト</h1>
          <p className={styles.muted}>配送先住所がありません。先に登録してください。</p>
          <p className={styles.actions}>
            <Link className={styles.primary} href="/mypage/addresses">配送先を登録する</Link>
          </p>
        </main>
      </RequireLogin>
    );
  }

  return (
    <RequireLogin redirectTo={`/login?next=${encodeURIComponent("/checkout")}`}>
      <main className={styles.page}>
        <h1 className={styles.title}>チェックアウト</h1>
        {err && <p className={styles.error}>{err}</p>}

        <section className={styles.section}>
          <h2 className={styles.h2}>配送先の選択</h2>
          <ul className={styles.addrList}>
            {list.map((a) => (
              <li key={a.id} className={styles.addrItem}>
                <label className={styles.addrRow}>
                  <input
                    type="radio"
                    name="addr"
                    checked={selectedId === a.id}
                    onChange={() => onChangeSelect(a.id)}
                  />
                  <span className={styles.addrBody}>
                    <span className={styles.name}>
                      {a.recipient_name} {a.is_default && <em className={styles.badge}>既定</em>}
                    </span>
                    <span className={styles.line}>
                      〒{formatPostal7(a.postal_code)} / {a.address_1}{a.address_2 ? ` ${a.address_2}` : ""}
                    </span>
                    <span className={styles.line}>{a.phone}</span>
                  </span>
                </label>
              </li>
            ))}
          </ul>
          {saving && <p className={styles.muted}>保存中…</p>}
          <p className={styles.helper}>
            住所の追加・編集は <Link href="/mypage/addresses" className={styles.link}>住所帳</Link> から行えます。
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.h2}>お支払いへ</h2>
          <div className={styles.actions}>
            <button
              type="button"
              className={styles.primary}
              onClick={onContinue}
              disabled={!selectedId}
            >
              支払いへ進む
            </button>
            <Link className={styles.secondary} href="/">トップへ戻る</Link>
          </div>
        </section>
      </main>
    </RequireLogin>
  );
}
