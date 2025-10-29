// frontend/src/app/payment-report/page.tsx
"use client";
import Link from "next/link";
import { useMemo, useState } from "react";

type SP = { [key: string]: string | string[] | undefined };
const pick = (sp: SP, k: string) => {
  const v = sp[k];
  return Array.isArray(v) ? v[0] : v;
};

export default function PaymentReportPage({
  searchParams,
}: {
  searchParams: SP;
}) {
  const initialOrderId = pick(searchParams, "orderId") ?? "";
  const [orderId, setOrderId] = useState(initialOrderId);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");

  const mailto = useMemo(() => {
    const to = "support@example.com"; // 後で差し替え
    const subject = encodeURIComponent(`お支払い連絡（注文 #${orderId || "未記入"}）`);
    const body = encodeURIComponent(
      `注文ID: ${orderId}\nお名前: ${name}\n金額: ${amount}\n入金日: ${date}\n\n備考: `
    );
    return `mailto:${to}?subject=${subject}&body=${body}`;
  }, [orderId, name, amount, date]);

  return (
    <main style={{ maxWidth: 720, margin: "40px auto", padding: "0 16px" }}>
      <h1>お支払い（お振込）連絡</h1>
      <p>お振込後、下記の内容をご連絡ください。まずはメール連絡で受付けます。</p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          window.location.href = mailto; // まずはメール起動。後でAPI連携に差し替え
        }}
        style={{ marginTop: 16 }}
      >
        <div style={{ margin: "12px 0" }}>
          <label>注文ID</label>
          <input
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            placeholder="例: 12345"
            style={{ display: "block", width: "100%", padding: 8 }}
          />
        </div>
        <div style={{ margin: "12px 0" }}>
          <label>お名前</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="山田 太郎"
            style={{ display: "block", width: "100%", padding: 8 }}
          />
        </div>
        <div style={{ margin: "12px 0" }}>
          <label>金額（円）</label>
          <input
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="例: 3980"
            inputMode="numeric"
            style={{ display: "block", width: "100%", padding: 8 }}
          />
        </div>
        <div style={{ margin: "12px 0" }}>
          <label>入金日</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            style={{ display: "block", width: "100%", padding: 8 }}
          />
        </div>

        <button type="submit" style={{ padding: "10px 16px" }}>
          メールで連絡する
        </button>
      </form>

      <div style={{ marginTop: 24 }}>
        {orderId ? (
          <p>
            注文詳細：<Link href={`/mypage/orders/${orderId}`}>注文 #{orderId}</Link>
          </p>
        ) : null}
        <p style={{ marginTop: 8 }}>
          <Link href="/mypage/orders">注文履歴をみる</Link>
        </p>
      </div>
    </main>
  );
}
