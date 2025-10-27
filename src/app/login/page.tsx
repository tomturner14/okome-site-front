"use client";

import { useState } from "react";
import Link from "next/link";
import { z } from "zod";
import { api } from "@/lib/api";
import { AuthOkSchema } from "@/types/api";
import styles from "./LoginPage.module.scss";

const LoginInputSchema = z.object({
  email: z.string().email("メール形式が正しくありません"),
  password: z.string().min(6, "パスワードは6文字以上"),
});

type LoginInput = z.infer<typeof LoginInputSchema>;

export default function LoginPage() {
  const [form, setForm] = useState<LoginInput>({ email: "", password: "" });
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  function onChange<K extends keyof LoginInput>(k: K, v: string) {
    setForm((s) => ({ ...s, [k]: v }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);

    const parsed = LoginInputSchema.safeParse(form);
    if (!parsed.success) {
      const msg = parsed.error.issues[0]?.message ?? "入力エラー";
      setErr(msg);
      return;
    }

    try {
      setBusy(true);
      const raw = await api<unknown>("/auth/login", {
        method: "POST",
        body: parsed.data,
        parseErrorJson: true, // ← これで {error, code} を拾える
      });
      AuthOkSchema.parse(raw);
      location.href = "/";
    } catch (e: any) {
      // api.ts が throw する { status, data } を想定
      const apiMsg = e?.data?.error ?? e?.message ?? "ログインに失敗しました";
      setErr(apiMsg);
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
            value={form.email}
            onChange={(e) => onChange("email", e.target.value)}
            required
          />
        </label>

        <label className={styles.field}>
          <span className={styles.label}>パスワード:</span>
          <input
            className={styles.input}
            type="password"
            autoComplete="current-password"
            value={form.password}
            onChange={(e) => onChange("password", e.target.value)}
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

        <Link href="/" className={styles.secondary}>トップへ戻る</Link>
      </form>
    </main>
  );
}
