export async function apiGet<T>(path: string): Promise<T> {
  const url = path.startsWith("/") ? `/api${path}` : `/api/${path}`;

  const res = await fetch(url, { credentials: "include" });

  const text = await res.text();
  const data = (() => { try { return JSON.parse(text); } catch { return text; } })();

  if (!res.ok) throw new Error(`HTTP ${res.status}: ${JSON.stringify(data)}`);

  return data as T;
}