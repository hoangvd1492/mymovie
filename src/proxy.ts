import { NextResponse, NextRequest } from "next/server";
import { updateSession } from "./lib/supabase/middleware";

// This function can be marked `async` if using `await` inside
export function proxy(request: NextRequest) {
  updateSession(request);

  return NextResponse.next({
    request,
  });
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
