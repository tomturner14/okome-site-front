"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";
import styles from "./LoginPage.module.scss";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setBusy(true);
    try {
      await api("/auth/login", {
        method: "POST",
        body: { email, password },
        parseErrorJson: true,
      });
      router.replace("/");
      router.refresh();
    } catch (e: any) {
      setErr(e?.data?.error ?? e?.message ?? "ログインに失敗しました");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className={styles.page}>
      <h1 className={styles.title}>ログインページ</h1>
      <form className={styles.form} onSubmit={onSubmit}>
        <label className={styles.field}>
          <span className={styles.label}>メールアドレス:</span>
          <input
            className={styles.input}
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>

        <label className={styles.field}>
          <span className={styles.label}>パスワード:</span>
          <input
            className={styles.input}
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />
        </label>

        {err && <p className={styles.error}>{err}</p>}

        <button className={styles.button} type="submit" disabled={busy}>
          {busy ? "送信中..." : "ログイン"}
        </button>

        <p className={styles.helper}>
          アカウントをお持ちでない方は{" "}
          <Link href="/register" className={styles.link}>
            こちら
          </Link>{" "}
          から登録できます
        </p>

        <Link href="/" className={styles.secondary}>
          トップへ戻る
        </Link>
      </form>
    </main>
  );
}
