"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { MeResponseSchema, ApiErrorSchema, type MeResponse } from "@/types/api";
import styles from "./SessionBadge.module.scss";

export default function SessionBadge() {
  const [me, setMe] = useState<MeResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        // 4xx/5xx でも JSON を読めるようにして、API 側の {error, code} を拾えるように
        const raw = await api<unknown>("/me", { parseErrorJson: true });
        const data = MeResponseSchema.parse(raw);
        if (active) setMe(data);
      } catch (e: any) {
        const parsed = ApiErrorSchema.safeParse(e?.data);
        if (active) {
          setError(parsed.success ? parsed.data.error : e?.message ?? "network error");
        }
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  async function handleLogout() {
    try {
      setBusy(true);
      await api("/auth/logout", { method: "POST", parseErrorJson: true });
      location.reload();
    } catch (e: any) {
      const parsed = ApiErrorSchema.safeParse(e?.data);
      setError(parsed.success ? parsed.data.error : e?.message ?? "logout failed");
    } finally {
      setBusy(false);
    }
  }

  if (error) return <span className={styles.chip}>状態: {error}</span>;
  if (!me) return <span className={styles.chip}>状態: 読み込み中...</span>;

  return (
    <span className={styles.chip} role="status" aria-live="polite">
      {me.loggedIn ? (
        <>
          <span>ようこそ</span>
          {me.user?.name ? <span className={styles.name}> {me.user.name}</span> : null}
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
