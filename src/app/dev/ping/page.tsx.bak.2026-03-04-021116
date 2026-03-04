"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export default function DevPingPage() {
  const [count, setCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function ping() {
    try {
      setLoading(true);
      setError(null);
      // バックエンドの /api/dev/session-ping(cookieを発行&カウント+1)
      const res = await api<{ ping: number }>("/dev/session-ping");
      setCount(res.ping);
    } catch (e: any) {
      setError(e?.message ?? "unknown error");
    } finally {
      setLoading(false);
    }
  }

  // 初回実行（１回目で Set-Cookie が飛ぶ）
  useEffect(() => {
    ping();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main style={{ padding: 24 }}>
      <h1>Dev: Session Ping</h1>
      <p>サーバのセッションに <code>ping</code> をカウントします。</p>
      <div style={{ margin: "12px 0" }}>
        <button onClick={ping} disabled={loading} style={{ padding: "8px 16px" }}>
          {loading ? "迷走中..." : "もう一回 ping する"}
        </button>
      </div>
      <div>
        {error && <p style={{ color: "crimson" }}>Error: {error}</p>}
        <p>現在の ping 値: <b>{count ?? "-"}</b></p>
      </div>
      <hr />
      <p>DevTools → Application → Cookies（localhost）で<code>connect.sid</code>があることを確認。</p>
      <p>Network → session-ping リクエストに Cookie ヘッダーが付いていることもチェック。</p>
    </main>
  );
}