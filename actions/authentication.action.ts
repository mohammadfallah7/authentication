"use server";

import { auth } from "@/lib/auth";
import { RegisterPayload } from "@/types";

export async function register(payload: RegisterPayload) {
  try {
    const res = await auth.api.signUpEmail({ body: { ...payload } });

    return { success: true, status: 201, response: res };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to register";

    return { success: false, status: 500, error: message };
  }
}
