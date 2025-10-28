// src/lib/shopify.ts
import { api } from "@/lib/api";

export type CheckoutLine = { variantId: string; quantity: number };

export type CreateCheckoutOptions = {
  email?: string;
  note?: string;
  // 事前に住所を埋めたい場合（必要に応じて拡張）
  shippingAddress?: {
    firstName?: string;
    lastName?: string;
    address1?: string;
    address2?: string;
    city?: string;
    province?: string;
    country?: string;
    zip?: string;
    phone?: string;
  };
};

export async function createCheckout(
  lines: CheckoutLine[],
  opts: CreateCheckoutOptions = {}
): Promise<string> {
  const res = await api<{ url: string }>("/shopify/checkout", {
    method: "POST",
    body: { lines, ...opts },
    parseErrorJson: true,
  });
  return res.url;
}
