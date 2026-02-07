// next.config.ts の rewrites で http://localhost:4000 にプロキシされる前提
// Server Component からは絶対 URLが必要なため、ここで生成する

const BASE = "/api";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

type FetchOptions = {
  method?: HttpMethod;
  headers?: Record<string, string>;
  body?: any;
  parseErrorJson?: boolean; // エラー時に JSON 解析を試す
  cache?: RequestCache;
};

function resolveOrigin(): string {
  if (typeof window !== "undefined") {
    return window.location.origin; // ブラウザ
  }
  // サーバー側（dev 既定）。本番は環境変数で上書き可能
  return process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
}

function makeUrl(path: string): string {
  if (/^https?:\/\//i.test(path)) return path;
  const basePath = path.startsWith("/") ? `${BASE}${path}` : `${BASE}/${path}`;
  const origin = resolveOrigin();
  // サーバーでは絶対 URL、クライアントでは相対でも可（統一で OK）
  return typeof window === "undefined" ? origin + basePath : basePath;
}

function extractErrorMessage(data: unknown, fallback: string): string {
  if (data && typeof data === "object") {
    const anyObj = data as { error?: unknown };
    if (typeof anyObj.error === "string" && anyObj.error.trim()) return anyObj.error;
  }
  if (typeof data === "string" && data.trim()) return data;
  return fallback;
}

export async function api<T = unknown>(
  path: string,
  opts: FetchOptions = {}
): Promise<T> {
  const url = makeUrl(path);

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
    cache: opts.cache ?? "no-store",
  });

  if (!res.ok) {
    const raw = await res.text();
    let data: unknown = undefined;

    if (opts.parseErrorJson) {
      try {
        data = JSON.parse(raw);
      } catch {
        // JSON じゃなければそのままテキストを返す
        data = raw;
      }
    }

    const fallback = `HTTP ${res.status}`;
    const msg = extractErrorMessage(data, fallback);

    throw Object.assign(new Error(msg), {
      status: res.status,
      data,
    });
  }

  // 正常時は JSON を一度だけ読む
  return (await res.json()) as T;
}
