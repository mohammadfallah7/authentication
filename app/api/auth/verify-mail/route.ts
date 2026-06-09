import { verifyEmail } from "@/actions";
import { NextRequest, NextResponse } from "next/server";

export const PUT = async (request: NextRequest) => {
  const searchParams = request.nextUrl.searchParams;
  const token = searchParams.get("token");

  if (!token) {
    return NextResponse.json({
      success: false,
      status: 400,
      error: "The token is required",
    });
  }

  try {
    const res = await verifyEmail({ token });
    return NextResponse.json(res, { status: res.status });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to verify your email address";
    return NextResponse.json(
      { success: false, status: 500, error: message },
      { status: 500 },
    );
  }
};
