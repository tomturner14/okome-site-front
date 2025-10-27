// frontend/src/lib/format.ts

/** JPY を "¥1,234" 形式で返す（小数なし） */
export function formatPrice(amount: number): string {
  const n = Number(amount ?? 0);
  return "¥" + new Intl.NumberFormat("ja-JP", { maximumFractionDigits: 0 }).format(n);
}

/** ISO文字列/Date を "YYYY/MM/DD HH:mm"（ローカル）に整形 */
export function formatDateTime(input: string | Date): string {
  const d = typeof input === "string" ? new Date(input) : input;
  if (Number.isNaN(d.getTime())) return "";
  const f = new Intl.DateTimeFormat("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  // 例: "2025/10/24 03:22"
  const parts = f.formatToParts(d);
  const get = (t: Intl.DateTimeFormatPartTypes) => parts.find(p => p.type === t)?.value ?? "";
  return `${get("year")}/${get("month")}/${get("day")} ${get("hour")}:${get("minute")}`;
}

/** "1234567" を "123-4567" に整形（7桁以外はそのまま） */
export function formatPostal7(value: string): string {
  const digits = String(value ?? "").replace(/\D/g, "");
  if (digits.length !== 7) return value ?? "";
  return `${digits.slice(0, 3)}-${digits.slice(3)}`;
}
