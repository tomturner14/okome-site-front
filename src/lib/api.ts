// next.config.tsのrewritesで4000にプロキシされる
const BASE = "/api";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

type FetchOptions = {
  method?: HttpMethod;
  headers?: Record<string, string>;
  // JSONを送る場合のbody（オブジェクトでもstringでもOK）
  body?: any;
  // 200以外もJSONを読むかどうか（デバック用）
  parseErrorJson?: boolean;
};

export async function api<T = unknown>(
  path: string,
  opts: FetchOptions = {}
): Promise<T> {
  const url = path.startsWith("/") ? `${BASE}${path}` : `${BASE}/${path}`;

  const headers: Record<string, string> = {
    "Accept": "application/json",
    ...opts.headers,
  };

  let body: BodyInit | undefined;
  if (opts.body !== undefined) {
    // すでにstringならそのまま、オブジェクトならJSON化
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
  });

  if (!res.ok) {
    // エラー本文が JSON の場合も読みたい時はtrueに
    if (opts.parseErrorJson) {
      try {
        const data = await res.json();
        throw Object.assign(new Error("API error"), { status: res.status, data });
      } catch {
        /* fallthrough */
      }
    }
    throw Object.assign(new Error(`HTTP ${res.status}`), { status: res.status, text: await res.text() });
  }
  // JSONを返すAPIを想定
  return (await res.json()) as T;
}