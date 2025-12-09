import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// 👇 ここでは「何も判断しないでそのまま通す」だけ
export function middleware(_req: NextRequest) {
  return NextResponse.next();
}

// 必要なら /app 配下だけに適用してもOK（なくても動く）
export const config = {
  matcher: ["/app/:path*"],
};
