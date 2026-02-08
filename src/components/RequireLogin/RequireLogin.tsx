"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { api } from "@/lib/api";
import { MeResponseSchema } from "@/types/api";

type Props = {
  children: React.ReactNode;
  /**
   * 未ログイン時の遷移先を完全指定したい場合のみ使う。
   * 未指定なら /login?next=<現在URL(クエリ込み)> にする。
   */
  redirectTo?: string;
};

function buildCurrentUrl(pathname: string, searchParams: URLSearchParams): string {
  const qs = searchParams.toString();
  return qs ? `${pathname}?${qs}` : pathname;
}

export default function RequireLogin({ children, redirectTo }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [allowed, setAllowed] = useState<boolean | null>(null);

  const current = useMemo(() => buildCurrentUrl(pathname, searchParams), [pathname, searchParams]);
  const nextUrl = useMemo(() => {
    return redirectTo ?? `/login?next=${encodeURIComponent(current)}`;
  }, [redirectTo, current]);

  useEffect(() => {
    let active = true;

    (async () => {
      try {
        const raw = await api<unknown>("/me", { cache: "no-store", parseErrorJson: true });
        const me = MeResponseSchema.parse(raw);

        if (!active) return;

        if (me.loggedIn) {
          setAllowed(true);
        } else {
          router.replace(nextUrl);
        }
      } catch {
        if (!active) return;
        router.replace(nextUrl);
      }
    })();

    return () => {
      active = false;
    };
  }, [router, nextUrl]);

  if (allowed === null) {
    return (
      <main style={{ padding: 16 }}>
        <p>ログイン確認中...</p>
      </main>
    );
  }

  return <>{children}</>;
}
