import { VerifyEmailTemplate } from "@/components";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import prisma from "./prisma";
import resend from "./resend";

export const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: "postgresql" }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
  },
  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      await resend.emails.send({
        from: `${process.env.RESEND_SENDER_NAME} <${process.env.RESEND_SENDER_EMAIL}>`,
        to: user.email,
        subject: "Verify Your Email Address",
        react: VerifyEmailTemplate({
          email: user.email,
          name: user.name,
          verificationUrl: url,
        }),
      });
    },
    autoSignInAfterVerification: true,
  },
  plugins: [nextCookies()],
});
