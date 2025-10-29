// src/lib/shopify.ts
import { api } from "./api";

// 一覧
export async function getProducts(): Promise<any[]> {
  return await api<any[]>("/products", { method: "GET", cache: "no-store" });
}

// 単品（handle 指定）
export async function getProduct(handle: string): Promise<any> {
  return await api<any>(`/products/${encodeURIComponent(handle)}`, {
    method: "GET",
    cache: "no-store",
  });
}

/* --- 既存のCartContextが参照するスタブは維持（後で本実装に差し替え） --- */
export async function getCart(_id: string) { return null; }
export async function createCart() { return { id: "dummy", lineItems: [] }; }
export async function addToCart(_cartId: string, _variantId: string, _qty: number) {
  return { id: "dummy", lineItems: [] };
}
export async function removeFromCart(_lineItemId: string) {
  return { id: "dummy", lineItems: [] };
}
export async function updateCartItem(_lineItemId: string, _qty: number) {
  return { id: "dummy", lineItems: [] };
}
