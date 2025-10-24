"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";
import styles from "./Register.module.scss";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setBusy(true);
    try {
      await api("/auth/register", {
        method: "POST",
        body: { name, email, password },
        parseErrorJson: true,
      });
      router.replace("/");
      router.refresh();
    } catch (e: any) {
      setErr(e?.data?.error ?? e?.message ?? "登録に失敗しました");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className={styles.page}>
      <h1 className={styles.title}>新規登録</h1>
      <form className={styles.form} onSubmit={onSubmit}>
        <label className={styles.field}>
          <span className={styles.label}>お名前:</span>
          <input
            className={styles.input}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>

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
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />
        </label>

        {err && <p className={styles.error}>{err}</p>}

        <button className={styles.button} type="submit" disabled={busy}>
          {busy ? "送信中..." : "登録する"}
        </button>

        <p className={styles.helper}>
          すでにアカウントをお持ちの方は{" "}
          <Link href="/login" className={styles.link}>
            ログイン
          </Link>
        </p>
      </form>
    </main>
  );
}
