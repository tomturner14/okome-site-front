"use client";

import React, { useEffect, useState } from "react";
import { api } from "@/lib/api";

type MeResp = { loggedIn: boolean; sessionPing?: number };

export default function SessionBadge() {
  const [me, setMe] = useState<MeResp | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api<MeResp>("/me")
      .then((d) => setMe(d))
      .catch((e: any) => setError(e?.message ?? "network error"));
  }, []);

  const chip: React.CSSProperties = {
    fontSize: 12,
    padding: "2px 8px",
    borderRadius: 999,
    background: "#f0f2f5",
    border: "1px solid #e1e4e8",
    marginLeft: 8,
  };

  if (error) return <span style={chip}>状態: 取得失敗</span>;
  if (!me) return <span style={chip}>状態: 読み込み中...</span>;

  return (
    <span style={chip}>
      {me.loggedIn ? "ようこそ" : "未ログイン"}
      {typeof me.sessionPing === "number" ? ` ・ping:${me.sessionPing}` : ""}
    </span>
  );
}