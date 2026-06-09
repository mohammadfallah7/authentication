import { resetPassword } from "@/actions";
import { resetPasswordSchema } from "@/types";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

export const PUT = async (request: NextRequest) => {
  const body = await request.json();

  const validatedFields = resetPasswordSchema.safeParse(body);
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
    const res = await resetPassword(validatedFields.data);
    return NextResponse.json(res, { status: res.status });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to reset your password";
    return NextResponse.json(
      { success: false, status: 500, error: message },
      { status: 500 },
    );
  }
};
