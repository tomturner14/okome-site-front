// next.config.ts の rewrites で 4000 にプロキシされる
const BASE = "/api";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

type FetchOptions = {
  method?: HttpMethod;
  headers?: Record<string, string>;
  // JSON を送る場合の body（オブジェクトでも string でもOK）
  body?: any;
  // 200 以外も JSON を読むかどうか（デバッグ用）
  parseErrorJson?: boolean;
  // ← 追加: Next.js の fetch cache オプションを通せるようにする
  cache?: RequestCache;
};

export async function api<T = unknown>(
  path: string,
  opts: FetchOptions = {}
): Promise<T> {
  const url = path.startsWith("/") ? `${BASE}${path}` : `${BASE}/${path}`;

  const headers: Record<string, string> = {
    Accept: "application/json",
    ...opts.headers,
  };

  let body: BodyInit | undefined;
  if (opts.body !== undefined) {
    if (typeof opts.body === "string") {
      body = opts.body;
    } else {
      body = JSON.stringify(opts.body);
      headers["Content-Type"] = "application/json";
    }
  }

  const res = await fetch(url, {
    method: opts.method ?? "GET",
    headers,
    body,
    credentials: "include",
    // 既定は no-store（明示上書きOK）
    cache: opts.cache ?? "no-store",
  });

  if (!res.ok) {
    if (opts.parseErrorJson) {
      try {
        const data = await res.json();
        throw Object.assign(new Error("API error"), {
          status: res.status,
          data,
        });
      } catch {
        /* fallthrough */
      }
    }
    throw Object.assign(new Error(`HTTP ${res.status}`), {
      status: res.status,
      text: await res.text(),
    });
  }

  return (await res.json()) as T;
}
