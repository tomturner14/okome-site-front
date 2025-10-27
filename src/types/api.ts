import { z } from "zod";

/** ------- User ------- */
export const UserSchema = z.object({
  id: z.number(),
  email: z.string().email(),
  // name は null/未定義でも空文字に揃える
  name: z.string().optional().nullable().transform((v) => v ?? ""),
});
export type User = z.infer<typeof UserSchema>;

/** ------- /api/me ------- */
export const MeResponseSchema = z.object({
  loggedIn: z.boolean(),
  sessionPing: z.number().optional(),
  user: UserSchema.nullable().optional().transform((v) => v ?? null),
});
export type MeResponse = z.infer<typeof MeResponseSchema>;

/** ------- auth OK ------- */
export const AuthOkSchema = z.object({
  ok: z.literal(true),
  user: UserSchema,
});
export type AuthOk = z.infer<typeof AuthOkSchema>;

/** ------- 共通エラー（sendError 仕様） ------- */
export const ApiErrorSchema = z.object({
  ok: z.boolean().optional().default(false),
  code: z.string().optional(),
  error: z.string(),
  details: z.unknown().optional(),
});
export type ApiError = z.infer<typeof ApiErrorSchema>;
