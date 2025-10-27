// src/types/api.ts
import { z } from "zod";

export const UserSchema = z.object({
  id: z.number(),
  email: z.string().email(),
  // name が null/undefined のときは空文字に整形
  name: z.string().optional().nullable().transform((v) => v ?? ""),
});

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

export const OrderItemSchema = z.object({
  title: z.string(),
  quantity: z.number(),
  price: z.number(),
  image_url: z.string().optional().default(""),
});

export const OrderSchema = z.object({
  id: z.number(),
  total_price: z.number(),
  status: z.string(),          // バックの列挙型に合わせて後で厳密化してOK
  fulfill_status: z.string(),  // 同上
  ordered_at: z.string(),      // ISO 文字列想定（Dateなら toISOString で返せばOK）
  items: z.array(OrderItemSchema).optional().default([]),
});

export const OrdersResponseSchema = z.array(OrderSchema);
export type OrderItem = z.infer<typeof OrderItemSchema>;
export type Order = z.infer<typeof OrderSchema>;
