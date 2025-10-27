"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { z } from "zod";
import { api } from "@/lib/api";
import { AuthOkSchema } from "@/types/api";
import styles from "../login/LoginPage.module.scss"; // ← 共有

const RegisterInputSchema = z.object({
  email: z.string().email("メール形式が正しくありません"),
  password: z.string().min(6, "パスワードは6文字以上"),
  name: z.string().max(50, "名前は50文字以内").optional().transform((v) => v ?? ""),
});
type RegisterInput = z.infer<typeof RegisterInputSchema>;

function safeNext(next: string | null): string {
  if (!next) return "/";
  if (next.startsWith("http://") || next.startsWith("https://") || next.startsWith("//")) return "/";
  if (!next.startsWith("/")) return "/";
  return next;
}

export default function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [form, setForm] = useState<RegisterInput>({ email: "", password: "", name: "" });
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const nextParam = searchParams.get("next");

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
        body: parsed.data,
        parseErrorJson: true,
      });
      AuthOkSchema.parse(raw);
      router.replace(safeNext(nextParam));
    } catch (e: any) {
      const apiMsg = e?.data?.error ?? e?.message ?? "登録に失敗しました";
      setErr(apiMsg);
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className={styles.page}>
      <h1 className={styles.title}>会員登録</h1>

      <form className={styles.form} onSubmit={onSubmit}>
        <label className={styles.field}>
          <span className={styles.label}>お名前（任意）:</span>
          <input
            className={styles.input}
            type="text"
            value={form.name}
            onChange={(e) => onChange("name", e.target.value)}
            placeholder="山田 太郎"
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

        {err && <p className={styles.error}>{err}</p>}

        <button className={styles.button} type="submit" disabled={busy}>
          {busy ? "送信中..." : "登録する"}
        </button>

        <p className={styles.helper}>
          すでにアカウントをお持ちの方は{" "}
          <Link
            href={nextParam ? `/login?next=${encodeURIComponent(nextParam)}` : "/login"}
            className={styles.link}
          >
            こちら
          </Link>{" "}
          からログイン
        </p>

        <Link href="/" className={styles.secondary}>トップへ戻る</Link>
      </form>
    </main>
  );
}
