"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { api } from "@/lib/api";
import { MeResponseSchema } from "@/types/api";

type Props = {
  children: React.ReactNode;
  /** 未ログイン時に遷移するURL。未指定なら /login?next=<現在のパス> */
  redirectTo?: string;
};

export default function RequireLogin({ children, redirectTo }: Props) {
  const [allowed, setAllowed] = useState<boolean | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const raw = await api<unknown>("/me");
        const me = MeResponseSchema.parse(raw);

        if (!active) return;

        if (me.loggedIn) {
          setAllowed(true);
        } else {
          const next = redirectTo ?? `/login?next=${encodeURIComponent(pathname)}`;
          location.href = next;
        }
      } catch {
        if (!active) return;
        const next = redirectTo ?? `/login?next=${encodeURIComponent(pathname)}`;
        location.href = next;
      }
    })();
    return () => { active = false; };
  }, [pathname, redirectTo]);

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
