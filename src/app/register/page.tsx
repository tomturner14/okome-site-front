"use client";

import { useState } from "react";
import Link from "next/link";
import { z } from "zod";
import { api } from "@/lib/api";
import { AuthOkSchema } from "@/types/api"; // 既存の { ok: true, user: {...} } 用
import styles from "./RegisterPage.module.scss";

// 入力バリデーション
const RegisterInputSchema = z
  .object({
    name: z.string().trim().max(50, "名前は50文字以内"),
    email: z.string().email("メール形式が正しくありません"),
    password: z.string().min(6, "パスワードは6文字以上"),
    confirm: z.string().min(6, "確認用パスワードは6文字以上"),
  })
  .refine((d) => d.password === d.confirm, {
    message: "パスワードが一致しません",
    path: ["confirm"],
  });

type RegisterInput = z.infer<typeof RegisterInputSchema>;

export default function RegisterPage() {
  const [form, setForm] = useState<RegisterInput>({
    name: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  function onChange<K extends keyof RegisterInput>(k: K, v: string) {
    setForm((s) => ({ ...s, [k]: v }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);

    const parsed = RegisterInputSchema.safeParse(form);
    if (!parsed.success) {
      const first = parsed.error.issues[0];
      setErr(first?.message ?? "入力エラー");
      return;
    }

    try {
      setBusy(true);
      const raw = await api<unknown>("/auth/register", {
        method: "POST",
        body: {
          name: parsed.data.name,
          email: parsed.data.email,
          password: parsed.data.password,
        },
        parseErrorJson: true, // バックエンドの {error:"..."} を拾う
      });
      AuthOkSchema.parse(raw);
      // 登録成功時はセッションが張られるのでトップへ
      location.href = "/";
    } catch (e: any) {
      setErr(e?.data?.error ?? e?.message ?? "登録に失敗しました");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className={styles.page}>
      <h1 className={styles.title}>会員登録</h1>

      <form className={styles.form} onSubmit={onSubmit}>
        <label className={styles.field}>
          <span className={styles.label}>お名前:</span>
          <input
            className={styles.input}
            type="text"
            autoComplete="name"
            value={form.name}
            onChange={(e) => onChange("name", e.target.value)}
          />
        </label>

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
            autoComplete="new-password"
            value={form.password}
            onChange={(e) => onChange("password", e.target.value)}
            required
            minLength={6}
          />
        </label>

        <label className={styles.field}>
          <span className={styles.label}>パスワード（確認）:</span>
          <input
            className={styles.input}
            type="password"
            autoComplete="new-password"
            value={form.confirm}
            onChange={(e) => onChange("confirm", e.target.value)}
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
          </Link>{" "}
          へ
        </p>

        <Link href="/" className={styles.secondary}>
          トップへ戻る
        </Link>
      </form>
    </main>
  );
}
