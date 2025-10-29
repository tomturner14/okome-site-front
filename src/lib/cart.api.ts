import { api } from "./api";

export type CartItem = {
  variantId: string;
  quantity: number;
  title?: string;
  price?: number; // 円（数値）
};
export type CartItemEx = CartItem & { image?: string; handle?: string };

export async function getCart() {
  return await api<CartItemEx[]>("/carts", { method: "GET", cache: "no-store" });
}

export async function addToCart(item: CartItemEx) {
  return await api<{ items: CartItemEx[] }>("/carts/add", { method: "POST", body: item });
}

export async function setQty(variantId: string, quantity: number) {
  return await api<{ items: CartItemEx[] }>("/carts/set-qty", { method: "PUT", body: { variantId, quantity } });
}

export async function removeFromCart(variantId: string) {
  return await api<{ items: CartItemEx[] }>("/carts/remove", { method: "DELETE", body: { variantId } });
}

export async function clearCart() {
  return await api("/carts/clear", { method: "DELETE" });
}
