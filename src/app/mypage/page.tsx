import { cookies } from "next/headers";
import Link from "next/link";

type MeResp = {
  loggedIn: boolean;
  sessionPing?: number;
  user?: { id: number; email: string; name: string | null } | null;
};

export default async function MyPage() {
  // SSR でブラウザの Cookie を API に転送するのがポイント
  const cookieHeader = (await cookies()).toString();
  const apiBase = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

  const res = await fetch(`&{apiBase}/api/me`, {
    headers: { cookie: cookieHeader },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("failed to load /api/me");
  }

  const me: MeResp = await res.json();

  if (!me.loggedIn) {
    return (
      <main style={{ padding: 24 }}>
        <h1>マイページ</h1>
        <p>ログインが必要です。</p>
        <Link href="/login">ログインへ</Link>
      </main>
    );
  }

  return (
    <main style={{ padding: 24 }}>
      <h1>マイページ</h1>
      <p>
        名前：<b>{me.user?.name ?? "(no name)"}</b>
      </p>
      <p>メール：{me.sessionPing ?? "-"}</p>
      <Link href="/">トップへ</Link>
    </main>
  );
}