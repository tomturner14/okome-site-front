"use client";

import { useState } from "react";
import { z } from "zod";
import Link from "next/link";
import { api } from "@/lib/api";
import { AuthOkSchema } from "@/types/api";
import styles from "./RegisterPage.module.scss";

const RegisterInputSchema = z.object({
  name: z.string().trim().min(1, "お名前を入力してください"),
  email: z.string().email("メール形式が正しくありません"),
  password: z.string().min(6, "パスワードは6文字以上"),
  passwordConfirm: z.string().min(6, "確認用パスワードは6文字以上"),
}).refine((d) => d.password === d.passwordConfirm, {
  path: ["passwordConfirm"],
  message: "パスワードが一致しません",
});

type RegisterInput = z.infer<typeof RegisterInputSchema>;

export default function RegisterPage() {
  const [form, setForm] = useState<RegisterInput>({
    name: "",
    email: "",
    password: "",
    passwordConfirm: "",
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
      const msg = parsed.error.issues[0]?.message ?? "入力エラー";
      setErr(msg);
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
        // 統一エラー(JSON)を受け取る
        parseErrorJson: true,
      });
      const ok = AuthOkSchema.parse(raw);
      // 成功時はトップへ
      location.href = "/";
    } catch (e: any) {
      const apiMsg: string | undefined = e?.data?.error;
      setErr(apiMsg ?? e?.message ?? "登録に失敗しました");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className={styles.page}>
      <h1 className={styles.title}>新規登録</h1>
      <form className={styles.form} onSubmit={onSubmit}>
        <label className={styles.field}>
          <span className={styles.label}>お名前</span>
          <input
            className={styles.input}
            type="text"
            value={form.name}
            onChange={(e) => onChange("name", e.target.value)}
            required
          />
        </label>

        <label className={styles.field}>
          <span className={styles.label}>メールアドレス</span>
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
          <span className={styles.label}>パスワード</span>
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
          <span className={styles.label}>パスワード（確認）</span>
          <input
            className={styles.input}
            type="password"
            autoComplete="new-password"
            value={form.passwordConfirm}
            onChange={(e) => onChange("passwordConfirm", e.target.value)}
            required
            minLength={6}
          />
        </label>

        {err && <p className={styles.error}>{err}</p>}

        <button className={styles.button} type="submit" disabled={busy}>
          {busy ? "送信中..." : "登録する"}
        </button>

        <p className={styles.helper}>
          既にアカウントをお持ちの方は{" "}
          <Link href="/login" className={styles.link}>
            ログイン
          </Link>
          へ
        </p>

        <Link href="/" className={styles.secondary}>
          トップへ戻る
        </Link>
      </form>
    </main>
  );
}
