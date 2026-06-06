"use server";

import { auth } from "@/lib/auth";
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
      error instanceof Error ? error.message : "Verification failed";
    return { success: false, status: 500, error: message };
  }
}

export async function logout() {
  try {
    const res = await auth.api.signOut({ headers: await headers() });

    return { success: true, status: 200, response: res };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to logout";

    return { success: false, status: 500, error: message };
  }
}

export async function forgotPassword(payload: ForgotPasswordPayload) {
  try {
    const res = await auth.api.requestPasswordReset({
      body: { ...payload, redirectTo: "/reset-password" },
    });

    return { success: true, status: 200, response: res };
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

    const res = await auth.api.resetPassword({
      body: { newPassword: payload.newPassword, token: payload.token },
    });

    return { success: true, status: 200, response: res };
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to send reset password link";

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
      const res = await auth.api.disableTwoFactor({
        body: { password: payload.password },
        headers: await headers(),
      });

      return { success: true, status: 200, response: res };
    } else {
      const res = await auth.api.enableTwoFactor({
        body: { password: payload.password },
        headers: await headers(),
      });

      return { success: true, status: 200, response: res };
    }
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to send reset password link";

    return { success: false, status: 500, error: message };
  }
}
