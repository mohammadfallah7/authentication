import { register } from "@/actions";
import { registerSchema } from "@/types";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

export const POST = async (request: NextRequest) => {
  const body = await request.json();

  const validatedFields = registerSchema.safeParse(body);
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
    const res = await register(validatedFields.data);
    return NextResponse.json(res, { status: res.status });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Register failed";
    return NextResponse.json(
      { success: false, status: 500, error: message },
      { status: 500 },
    );
  }
};
