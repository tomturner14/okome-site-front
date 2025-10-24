"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import styles from "./SessionBadge.module.scss";

type MeResp = { loggedIn: boolean; sessionPing?: number };

export default function SessionBadge() {
  const [me, setMe] = useState<MeResp | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let active = true;
    api<MeResp>("/me")
      .then((d) => active && setMe(d))
      .catch((e: any) => active && setError(e?.message ?? "network error"));
    return () => {
      active = false;
    };
  }, []);

  async function handleLogout() {
    try {
      setBusy(true);
      await api("/auth/logout", { method: "POST" });
    } finally {
      location.reload();
    }
  }

  if (error) return <span className={styles.chip}>状態: 取得失敗</span>;
  if (!me) return <span className={styles.chip}>状態: 読み込み中...</span>;

  return (
    <span className={styles.chip} role="status" aria-live="polite">
      {me.loggedIn ? (
        <>
          <span>ようこそ</span>
          {typeof me.sessionPing === "number" && (
            <span className={styles.count}>・ping:{me.sessionPing}</span>
          )}
          <button
            type="button"
            className={styles.btn}
            onClick={handleLogout}
            disabled={busy}
          >
            {busy ? "処理中..." : "ログアウト"}
          </button>
        </>
      ) : (
        <>
          <span>未ログイン</span>
          <Link href="/login" className={styles.btn}>
            ログイン
          </Link>
        </>
      )}
    </span>
  )
};