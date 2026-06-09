import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
  try {
    const res = await auth.api.getSession({ headers: request.headers });
    return NextResponse.json(
      { success: true, status: 200, response: res },
      { status: 200 },
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to check session";
    return NextResponse.json(
      { success: false, status: 500, error: message },
      { status: 500 },
    );
  }
};
