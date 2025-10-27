"use client";

import { ReactNode, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { MeResponseSchema, type MeResponse } from "@/types/api";

type Props = { children: ReactNode };

export default function RequireLogin({ children }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [me, setMe] = useState<MeResponse | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const raw = await api<unknown>("/me", { method: "GET" });
        const parsed = MeResponseSchema.parse(raw);
        if (!active) return;

        if (parsed.loggedIn) {
          setMe(parsed);
        } else {
          // 未ログイン → /login?next=/current
          const next = encodeURIComponent(pathname || "/");
          router.replace(`/login?next=${next}`);
        }
      } catch (e: any) {
        if (!active) return;
        setErr(e?.message ?? "認証状態の確認に失敗しました");
      }
    })();
    return () => {
      active = false;
    };
  }, [pathname, router]);

  if (err) return <p>読み込みエラー: {err}</p>;
  if (!me) return <p>確認中...</p>;

  return <>{children}</>;
}
