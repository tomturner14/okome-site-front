"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { api } from "@/lib/api";
import { MeResponseSchema, type MeResponse } from "@/types/api";

export default function MyPageButton({ className }: { className?: string }) {
  const pathname = usePathname();
  const [authed, setAuthed] = useState<boolean | null>(null);

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        // 自分で打つ：/me の本文 loggedIn を見てログイン判定する
        const raw = await api<unknown>("/me", {
          method: "GET",
          cache: "no-store",
        });

        const me: MeResponse = MeResponseSchema.parse(raw);

        if (alive) {
          setAuthed(me.loggedIn);
        }
      } catch {
        if (alive) {
          setAuthed(false);
        }
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  if (authed === null) return null;

  return authed ? (
    <Link href="/mypage" className={className}>
      マイページ
    </Link>
  ) : (
    <Link
      href={`/login?next=${encodeURIComponent(pathname ?? "/mypage")}`}
      className={className}
    >
      ログイン
    </Link>
  );
}