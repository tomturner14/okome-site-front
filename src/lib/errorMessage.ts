// src/lib/errorMessage.ts
type ApiErrShape = {
  status?: number;
  data?: { code?: string; message?: string } | string;
  message?: string;
};

export function toUserMessage(err: ApiErrShape, fallback = "エラーが発生しました。") {
  // サーバが返した日本語messageを最優先
  if (typeof err?.data === "object" && err?.data?.message) return err.data.message as string;

  // ステータスに応じた補助（バックエンドの既定メッセージと合わせる）
  if (err?.status === 401) return "ログインが必要です。";
  if (err?.status === 403) return "権限がありません。";
  if (err?.status === 404) return "対象が見つかりません。";
  if (err?.status === 400) return "入力内容が不正です。";

  // それでも無ければ既定
  return err?.message ?? fallback;
}
