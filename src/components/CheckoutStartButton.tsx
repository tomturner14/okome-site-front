"use client";

import { useState } from "react";
import { api } from "@/lib/api";

type Line = { variantId?: string; merchandiseId?: string; id?: string; quantity: number };
type Props = {
  lines: Line[];
  className?: string;
  label?: string;
  disabled?: boolean;
  shippingAddress?: Record<string, unknown>;
};

export default function CheckoutStartButton({
  lines,
  className,
  label = "Shopifyでお会計へ",
  disabled,
  shippingAddress,
}: Props) {
  const [loading, setLoading] = useState(false);

  const onClick = async () => {
    if (!lines?.length) {
      alert("商品が選択されていません");
      return;
    }
    try {
      setLoading(true);

      // ← api() を使うと parseErrorJson で message を拾える
      const { url } = await api<{ url: string }>("/shopify/checkout", {
        method: "POST",
        body: { lines, shippingAddress },
        parseErrorJson: true,
      });

      // 取得できたらリダイレクト
      location.href = url;
    } catch (e: any) {
      console.error("checkout error:", e);
      const msg =
        e?.data?.message ??
        e?.message ??
        "Checkout URL を取得できませんでした";
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button className={className} onClick={onClick} disabled={disabled || loading}>
      {loading ? "処理中…" : label}
    </button>
  );
}
