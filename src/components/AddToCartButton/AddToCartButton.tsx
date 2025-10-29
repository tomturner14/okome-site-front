"use client";

import { useState } from "react";

export default function AddToCartButton({
  variantId,
  quantity = 1,
  className,
  label = "カートに入れる",
  disabled = false,
  onAdded,
}: {
  variantId: string;
  quantity?: number;
  className?: string;
  label?: string;
  disabled?: boolean;
  onAdded?: (cartId: string) => void;
}) {
  const [busy, setBusy] = useState(false);

  const add = async () => {
    if (busy || disabled || !variantId) return;
    setBusy(true);
    try {
      // 既存カートIDがあれば add、なければ create
      let cartId = "";
      if (typeof window !== "undefined") {
        cartId = window.localStorage.getItem("sf_cart_id") ?? "";
      }

      if (!cartId) {
        // create
        const resp = await fetch("/api/shopify/cart", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ lines: [{ variantId, quantity }] }),
        });
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
        const data = await resp.json();
        cartId = data?.id ?? "";
        if (!cartId) throw new Error("No cart id");
        if (typeof window !== "undefined") {
          window.localStorage.setItem("sf_cart_id", cartId);
        }
      } else {
        // add lines
        const resp = await fetch("/api/shopify/cart/lines", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ cartId, lines: [{ variantId, quantity }] }),
        });
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
        // 返り値は使わなくてもOK
      }

      onAdded?.(cartId);
      alert("カートに追加しました！");
    } catch (e) {
      console.error(e);
      alert("カートに追加できませんでした。時間をおいて再度お試しください。");
    } finally {
      setBusy(false);
    }
  };

  return (
    <button type="button" className={className} onClick={add} disabled={busy || disabled || !variantId}>
      {busy ? "追加中..." : label}
    </button>
  );
}
