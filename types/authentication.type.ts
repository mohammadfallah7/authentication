import z from "zod";

export const registerSchema = z.object({
  name: z.string({ error: "Name filed is required" }).trim(),
  email: z.email({ error: "Email is invalid" }).trim(),
  password: z.string({ error: "Password filed is required" }).trim(),
});
export type RegisterPayload = z.infer<typeof registerSchema>;

export const loginSchema = registerSchema.omit({ name: true });
export type LoginPayload = z.infer<typeof loginSchema>;

export const forgotPasswordSchema = registerSchema.pick({ email: true });
export type ForgotPasswordPayload = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z
  .object({
    newPassword: z.string({ error: "Password filed is required" }).trim(),
    repeatPassword: z
      .string({ error: "Repeat password filed is required" })
      .trim(),
    token: z.string().nullish(),
  })
  .refine((data) => data.newPassword === data.repeatPassword, {
    error: "Passwords do not match",
    path: ["newPassword"],
  });
export type ResetPasswordPayload = z.infer<typeof resetPasswordSchema>;

export const toggle2FASchema = registerSchema.pick({ password: true });
export type Toggle2FAPayload = z.infer<typeof toggle2FASchema>;
