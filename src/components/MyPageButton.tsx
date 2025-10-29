"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { api } from "@/lib/api";

export default function MyPageButton({ className }: { className?: string }) {
  const pathname = usePathname();
  const [authed, setAuthed] = useState<boolean | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        // /api/me が 200 -> 認証済み
        await api("/me", { method: "GET", cache: "no-store" });
        if (alive) setAuthed(true);
      } catch {
        if (alive) setAuthed(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  if (authed === null) return null; // ローディング時は非表示でOK

  // 認証済みなら「マイページ」、未ログインなら「ログイン（復帰先付き）」
  return authed ? (
    <Link href="/mypage" className={className}>マイページ</Link>
  ) : (
    <Link
      href={`/login?next=${encodeURIComponent(pathname ?? "/mypage")}`}
      className={className}
    >
      ログイン
    </Link>
  );
}
