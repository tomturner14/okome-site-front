// src/app/dev/checkout-test/page.tsx
"use client";

import { useState } from "react";
import { createCheckout } from "@/lib/shopify";

export default function CheckoutTestPage() {
  const [variantId, setVariantId] = useState("");
  const [qty, setQty] = useState(1);
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onGo(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    try {
      setBusy(true);
      const url = await createCheckout([{ variantId, quantity: qty }], {
        note: "dev-checkout",
      });
      location.href = url; // ← Shopify の checkout URL へ移動
    } catch (e: any) {
      setErr(e?.data?.error ?? e?.message ?? "作成に失敗しました");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main style={{ padding: 24 }}>
      <h1>Checkout Test</h1>
      <form onSubmit={onGo} style={{ display: "grid", gap: 12, maxWidth: 520 }}>
        <label>
          <div>Variant ID</div>
          <input
            value={variantId}
            onChange={(e) => setVariantId(e.target.value)}
            placeholder="gid://shopify/ProductVariant/1234567890 など"
            style={{ width: "100%", padding: "8px 10px" }}
            required
          />
        </label>

        <label>
          <div>Quantity</div>
          <input
            type="number"
            min={1}
            value={qty}
            onChange={(e) => setQty(Number(e.target.value || 1))}
            style={{ width: 120, padding: "8px 10px" }}
            required
          />
        </label>

        {err && <p style={{ color: "#b00020" }}>{err}</p>}

        <button type="submit" disabled={busy} style={{ width: 160, padding: "10px 14px" }}>
          {busy ? "作成中..." : "チェックアウトへ"}
        </button>
      </form>
    </main>
  );
}
