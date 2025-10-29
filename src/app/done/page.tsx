// frontend/src/app/done/page.tsx
import Link from "next/link";

type SP = { [key: string]: string | string[] | undefined };
const pick = (sp: SP, k: string) => {
  const v = sp[k];
  return Array.isArray(v) ? v[0] : v;
};

export default function DonePage({ searchParams }: { searchParams: SP }) {
  const orderId = pick(searchParams, "orderId");
  const status = pick(searchParams, "status"); // 任意（ok / failed など想定）

  return (
    <main style={{ maxWidth: 720, margin: "40px auto", padding: "0 16px" }}>
      <h1>ご注文ありがとうございます</h1>
      <p>ご注文手続きが完了しました。確認メールをお送りしています。</p>

      {status && <p>ステータス: <strong>{status}</strong></p>}

      <div style={{ marginTop: 24 }}>
        {orderId ? (
          <p>
            この注文の詳細へ：{" "}
            <Link href={`/mypage/orders/${orderId}`}>注文 #{orderId}</Link>
          </p>
        ) : (
          <p>※ 注文IDが見つかりませんでした。</p>
        )}
        <p style={{ marginTop: 8 }}>
          <Link href="/mypage/orders">注文履歴をみる</Link>
        </p>
        <p style={{ marginTop: 8 }}>
          <Link href="/">トップへ戻る</Link>
        </p>
      </div>
    </main>
  );
}
