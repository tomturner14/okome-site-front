"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { api } from "@/lib/api";
import { MeResponseSchema } from "@/types/api";

type Props = {
  children: React.ReactNode;
  /** 未ログイン時に遷移するURL。未指定なら /login?next=<現在のパス＋クエリ> */
  redirectTo?: string;
};

function safeNext(next: string | null): string {
  if (!next) return "/";
  if (next.startsWith("http://") || next.startsWith("https://") || next.startsWith("//")) return "/";
  if (!next.startsWith("/")) return "/";
  return next;
}

export default function RequireLogin({ children, redirectTo }: Props) {
  const [allowed, setAllowed] = useState<boolean | null>(null);

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    let active = true;

    const current = (() => {
      const qs = searchParams.toString();
      return qs ? `${pathname}?${qs}` : pathname;
    })();

    (async () => {
      try {
        const raw = await api<unknown>("/me");
        const me = MeResponseSchema.parse(raw);

        if (!active) return;

        if (me.loggedIn) {
          setAllowed(true);
          return;
        }

        const nextUrl = redirectTo ?? `/login?next=${encodeURIComponent(current)}`;
        router.replace(safeNext(nextUrl));
      } catch {
        if (!active) return;
        const nextUrl = redirectTo ?? `/login?next=${encodeURIComponent(current)}`;
        router.replace(safeNext(nextUrl));
      }
    })();

    return () => { active = false; };
  }, [pathname, searchParams, redirectTo, router]);

  // 判定中のプレースホルダ
  if (allowed === null) {
    return (
      <main style={{ padding: 16 }}>
        <p>ログイン確認中...</p>
      </main>
    );
  }

  // 許可されたら子要素を表示
  return <>{children}</>;
}
