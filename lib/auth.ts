import {
  ResetPasswordTemplate,
  SendOTPTemplate,
  VerifyEmailTemplate,
} from "@/components";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { twoFactor } from "better-auth/plugins";
import prisma from "./prisma";
import resend from "./resend";

export const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: "postgresql" }),
  baseURL: process.env.BETTER_AUTH_URL,
  trustedOrigins: ["http://localhost:5173"],
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    revokeSessionsOnPasswordReset: true,
    sendResetPassword: async ({ user, url }) => {
      await resend.emails.send({
        from: `${process.env.RESEND_SENDER_NAME} <${process.env.RESEND_SENDER_EMAIL}>`,
        to: user.email,
        subject: "Reset Your Password",
        react: ResetPasswordTemplate({
          name: user.name,
          resetUrl: url,
        }),
      });
    },
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
    sendOnSignIn: true,
  },
  appName: "Authentication",
  plugins: [
    twoFactor({
      skipVerificationOnEnable: true,
      otpOptions: {
        sendOTP: async ({ user, otp }) => {
          await resend.emails.send({
            from: `${process.env.RESEND_SENDER_NAME} <${process.env.RESEND_SENDER_EMAIL}>`,
            to: user.email,
            subject: "Verify Your Account",
            react: SendOTPTemplate({ otpCode: otp, userEmail: user.email }),
          });
        },
      },
    }),
    nextCookies(),
  ],
});
