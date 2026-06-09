import { toggle2FA } from "@/actions";
import { toggle2FASchema } from "@/types";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

export const PUT = async (request: NextRequest) => {
  const body = await request.json();

  const validatedFields = toggle2FASchema.safeParse(body);
  if (!validatedFields.success) {
    return NextResponse.json(
      {
        success: false,
        status: 400,
        error: z.treeifyError(validatedFields.error).properties,
      },
      { status: 400 },
    );
  }

  try {
    const res = await toggle2FA(validatedFields.data);
    return NextResponse.json(res, { status: res.status });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to toggle Two-Factor authentication";
    return NextResponse.json(
      { success: false, status: 500, error: message },
      { status: 500 },
    );
  }
};
