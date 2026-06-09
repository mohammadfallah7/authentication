"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import {
  ForgotPasswordPayload,
  LoginPayload,
  RegisterPayload,
  ResetPasswordPayload,
  Toggle2FAPayload,
  VerifyOTPPayload,
} from "@/types";
import { headers } from "next/headers";

export async function register(payload: RegisterPayload) {
  try {
    const res = await auth.api.signUpEmail({
      body: { ...payload },
      headers: await headers(),
    });

    return { success: true, status: 201, response: res };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to register";

    return { success: false, status: 500, error: message };
  }
}

export async function verifyEmail(payload: { token: string }) {
  try {
    await auth.api.verifyEmail({
      query: { token: payload.token },
    });

    return {
      success: true,
      status: 200,
      response: "Your email address successfully verified",
    };
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to verify your email address";

    return { success: false, status: 500, error: message };
  }
}

export async function login(payload: LoginPayload) {
  try {
    const { headers: responseHeaders, response } = await auth.api.signInEmail({
      returnHeaders: true,
      body: { ...payload },
      headers: await headers(),
    });

    if ("twoFactorRedirect" in response) {
      const cookieHeader = responseHeaders.getSetCookie().join("; ");

      await auth.api.sendTwoFactorOTP({ headers: { cookie: cookieHeader } });

      return {
        success: true,
        status: 200,
        twoFactorRedirect: true,
        cookieHeader,
      };
    }

    return { success: true, status: 200, response };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to login";

    return { success: false, status: 500, error: message };
  }
}

export async function verifyOTP(payload: VerifyOTPPayload) {
  try {
    if (!payload.cookieHeader) {
      return { success: false, status: 400, error: "The cookie is required" };
    }

    const res = await auth.api.verifyTwoFactorOTP({
      body: { code: payload.code },
      headers: { cookie: payload.cookieHeader },
    });

    return { success: true, status: 200, response: res };
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to verify Two-Factor authentication";
    return { success: false, status: 500, error: message };
  }
}

export async function logout() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      return { success: false, status: 401, error: "Unauthorized" };
    }

    await auth.api.signOut({ headers: await headers() });

    return { success: true, status: 200, response: "Successfully logout" };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to logout";

    return { success: false, status: 500, error: message };
  }
}

export async function forgotPassword(payload: ForgotPasswordPayload) {
  try {
    const user = await prisma.user.findUnique({
      where: { email: payload.email },
      select: { id: true },
    });
    if (!user) {
      return {
        success: false,
        status: 404,
        error: "User with this email address not found",
      };
    }

    await auth.api.requestPasswordReset({
      body: { ...payload, redirectTo: "/reset-password" },
    });

    return {
      success: true,
      status: 200,
      response: "Check your email for the reset link",
    };
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to send reset password link";

    return { success: false, status: 500, error: message };
  }
}

export async function resetPassword(payload: ResetPasswordPayload) {
  try {
    if (!payload.token) {
      return { success: false, status: 400, error: "Token is required" };
    }

    await auth.api.resetPassword({
      body: { newPassword: payload.newPassword, token: payload.token },
    });

    return {
      success: true,
      status: 200,
      response: "Your password successfully reset",
    };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed reset your password";

    return { success: false, status: 500, error: message };
  }
}

export async function toggle2FA(payload: Toggle2FAPayload) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session) {
      return { success: false, status: 401, error: "Unauthorized" };
    }

    if (session.user.twoFactorEnabled) {
      await auth.api.disableTwoFactor({
        body: { password: payload.password },
        headers: await headers(),
      });

      return {
        success: true,
        status: 200,
        response: "Two-Factor authentication successfully disabled",
      };
    } else {
      await auth.api.enableTwoFactor({
        body: { password: payload.password },
        headers: await headers(),
      });

      return {
        success: true,
        status: 200,
        response: "Two-Factor authentication successfully enabled",
      };
    }
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to toggle Two-Factor authentication";

    return { success: false, status: 500, error: message };
  }
}
