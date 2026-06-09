import { logout } from "@/actions";
import { NextResponse } from "next/server";

export const POST = async () => {
  try {
    const res = await logout();
    return NextResponse.json(res, { status: res.status });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Logout failed";
    return NextResponse.json(
      { success: false, status: 500, error: message },
      { status: 500 },
    );
  }
};
