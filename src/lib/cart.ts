import * as api from "./cart.api";
import * as local from "./cart.local";

// 1 なら localStorage 版、未設定/0 なら API 版
const USE_LOCAL = process.env.NEXT_PUBLIC_USE_LOCAL_CART === "1";

// 型は API 版に寄せる（両者同一インターフェース）
export type CartItem = api.CartItem;
export type CartItemEx = api.CartItemEx;

const impl = USE_LOCAL ? local : api;

// ---- ラッパー（引数を明示して書く）----
export const getCart = (): ReturnType<typeof api.getCart> => {
  return impl.getCart();
};

export const addToCart = (item: CartItemEx): ReturnType<typeof api.addToCart> => {
  return impl.addToCart(item);
};

export const setQty = (
  variantId: string,
  quantity: number
): ReturnType<typeof api.setQty> => {
  return impl.setQty(variantId, quantity);
};

export const removeFromCart = (
  variantId: string
): ReturnType<typeof api.removeFromCart> => {
  return impl.removeFromCart(variantId);
};

export const clearCart = (): ReturnType<typeof api.clearCart> => {
  return impl.clearCart();
};
