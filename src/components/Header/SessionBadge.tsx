"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { MeResponseSchema, type MeResponse } from "@/types/api";
import styles from "./SessionBadge.module.scss";

export default function SessionBadge() {
  const [me, setMe] = useState<MeResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function load() {
    setError(null);
    try {
      const raw = await api<unknown>("/me");
      const parsed = MeResponseSchema.parse(raw);
      setMe(parsed);
    } catch (e: any) {
      setMe(null);
      setError(e?.message ?? "状態取得に失敗しました");
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleLogout() {
    try {
      setBusy(true);
      await api("/auth/logout", { method: "POST" });
    } finally {
      location.reload();
    }
  }

  if (error) {
    return (
      <span className={styles.chip} role="status" aria-live="polite">
        状態: 取得失敗
        <button type="button" className={styles.btn} onClick={load}>
          再試行
        </button>
      </span>
    );
  }

  if (!me) {
    return <span className={styles.chip}>状態: 読み込み中...</span>;
  }

  return (
    <span className={styles.chip} role="status" aria-live="polite">
      {me.loggedIn ? (
        <>
          <span>ようこそ</span>
          {me.user?.name ? <span> {me.user.name}</span> : null}
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
  );
}
