"use server";

import { auth } from "@/lib/auth";
import {
  ForgotPasswordPayload,
  LoginPayload,
  RegisterPayload,
  ResetPasswordPayload,
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
    const res = await auth.api.signInEmail({
      body: { ...payload },
      headers: await headers(),
    });

    return { success: true, status: 200, response: res };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to login";

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
