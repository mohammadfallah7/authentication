import z from "zod";

export const registerSchema = z.object({
  name: z.string({ error: "Name filed is required" }).trim(),
  email: z.email({ error: "Email is invalid" }).trim(),
  password: z.string({ error: "Password filed is required" }).trim(),
});
export type RegisterPayload = z.infer<typeof registerSchema>;

export const loginSchema = registerSchema.omit({ name: true });
export type LoginPayload = z.infer<typeof loginSchema>;
