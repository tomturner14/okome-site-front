// frontend/src/types/api.ts
import { z } from "zod";

export const UserSchema = z.object({
  id: z.number(),
  email: z.string().email(),
  // name が null/undefined のときは空文字に整形
  name: z.string().optional().nullable().transform((v) => v ?? ""),
});
export type User = z.infer<typeof UserSchema>;

export const MeResponseSchema = z.object({
  loggedIn: z.boolean(),
  sessionPing: z.number().optional(),
  user: UserSchema.nullable().optional().transform((v) => v ?? null),
});
export type MeResponse = z.infer<typeof MeResponseSchema>;

export const AuthOkSchema = z.object({
  ok: z.literal(true),
  user: UserSchema,
});
export type AuthOk = z.infer<typeof AuthOkSchema>;

// ---- orders (list/minimal) ----
export const OrderItemSchema = z.object({
  title: z.string(),
  quantity: z.number(),
  price: z.number(),
  image_url: z.string().optional().default(""),
});

export const OrderSchema = z.object({
  id: z.number(),
  total_price: z.number(),
  status: z.string(),          // ひとまず string。後で enum 厳密化OK
  fulfill_status: z.string(),  // 同上
  ordered_at: z.string(),      // ISO文字列（BEで toISOString 済み）
  items: z.array(OrderItemSchema).optional().default([]),
});

export const OrdersResponseSchema = z.array(OrderSchema);
export type OrderItem = z.infer<typeof OrderItemSchema>;
export type Order = z.infer<typeof OrderSchema>;

// ---- addresses ----
export const AddressSchema = z.object({
  id: z.number(),
  recipient_name: z.string(),
  postal_code: z.string().regex(/^\d{7}$/, "郵便番号は7桁（数字のみ）"),
  address_1: z.string(),
  address_2: z.string().optional().default(""),
  phone: z.string(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});
export const AddressesResponseSchema = z.array(AddressSchema);
export type Address = z.infer<typeof AddressSchema>;

export const AddressCreateInputSchema = z.object({
  recipient_name: z.string().min(1, "宛名を入力してください"),
  postal_code: z.string().regex(/^\d{7}$/, "郵便番号は7桁（数字のみ）"),
  address_1: z.string().min(1, "住所を入力してください"),
  address_2: z.string().optional().transform((v) => v ?? ""),
  phone: z.string().min(8, "電話番号を入力してください"),
});
export type AddressCreateInput = z.infer<typeof AddressCreateInputSchema>;

// 更新は作成と同じ形（エイリアス）
export const AddressUpdateInputSchema = AddressCreateInputSchema;
export type AddressUpdateInput = z.infer<typeof AddressUpdateInputSchema>;

// ---- order detail ----
export const OrderDetailSchema = z.object({
  id: z.number(),
  total_price: z.number(),
  status: z.string(),
  fulfill_status: z.string(),
  ordered_at: z.string(),
  cancelled_at: z.string().nullable().optional().transform((v) => v ?? null),
  fulfilled_at: z.string().nullable().optional().transform((v) => v ?? null),
  items: z.array(OrderItemSchema).default([]),
  // 住所は null の可能性あり（ゲスト／削除など）
  address: AddressSchema.nullable().optional().transform((v) => v ?? null),
});
export type OrderDetail = z.infer<typeof OrderDetailSchema>;
