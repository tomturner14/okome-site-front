"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./RegisterPage.module.scss";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const res = await fetch("/api/users/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    if (res.ok) {
      router.push("/login");
    } else {
      const data = await res.json();
      setError(data.error || "登録に失敗しました");
    }
  };

  return (
    <div className={styles.form}>
      <h1>新規登録</h1>
      <form onSubmit={handleSubmit}>
        <div className={styles.field}>
          <label>
            お名前:
            <input
              type="text"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </label>
        </div>
        <div className={styles.field}>
          <label>
            メールアドレス:
            <input
              type="email"
              name="email"
              value={email}
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
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
        </div>
        {error && <p className={styles.error}>{error}</p>}
        <div>
          <button type="submit" className={styles.submitButton}>
            登録
          </button>
        </div>
      </form>
      <div className={styles.linkArea}>
        <p>
          アカウントをお持ちの方は
          <Link href="/login" className={styles.linkGreen}>こちら</Link>
        </p>
        <Link href="/" className={styles.submitButton}>トップへ戻る</Link>
      </div>
    </div>
  );
}
