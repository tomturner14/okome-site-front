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
