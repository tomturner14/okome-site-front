"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from 'next/link';
import styles from './LoginPage.module.scss';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        throw new Error("ログインに失敗しました");
      }

      //成功時に　/mypage　へ遷移させる
      router.push("/mypage");
    } catch (err) {
      setError("ログインに失敗しました");
      console.error(err);
    }
  };

  return (
    <div className={styles.form}>
      <h1>ログインページ</h1>
      <form onSubmit={handleLogin}>
        {error && <p className={styles.error}>{error}</p>}
        <div className={styles.field}>
          <label>
            メールアドレス:
            <input
              type="email"
              name="email"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
        </div>
        <div className={styles.field}>
          <label>
            パスワード:
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
        </div>
        <div>
          <button type="submit" className={styles.submitButton}>
            ログイン
          </button>
        </div>
      </form>

      <div className={styles.linkArea}>
        <p>
          アカウントをお持ちでない方は
          <Link href="/register" className={styles.linkGreen}>
            こちら
          </Link>
          から登録できます。
        </p>
        <Link href="/" className={styles.submitButton}>
          トップへ戻る
        </Link>
      </div>
    </div>
  );
}
