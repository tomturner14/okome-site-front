// frontend/src/app/confirm/page.tsx
import Link from "next/link";

type SP = { [key: string]: string | string[] | undefined };
const pick = (sp: SP, k: string) => {
  const v = sp[k];
  return Array.isArray(v) ? v[0] : v;
};

export default function ConfirmPage({ searchParams }: { searchParams: SP }) {
  const orderId = pick(searchParams, "orderId");

  return (
    <main style={{ maxWidth: 720, margin: "40px auto", padding: "0 16px" }}>
      <h1>お支払い確認中です</h1>
      <p>ただいま決済の確認を行っています。反映まで数分かかる場合があります。</p>

      <div style={{ marginTop: 24 }}>
        {orderId ? (
          <p>
            進捗は{" "}
            <Link href={`/mypage/orders/${orderId}`}>注文 #{orderId}</Link>{" "}
            でご確認いただけます。
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
