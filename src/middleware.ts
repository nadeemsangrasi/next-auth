import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = cookies().get("token")?.value || "";
  const path = request.nextUrl.pathname;

  const isPublicPath =
    path === "/sign-in" || path === "/sign-up" || path === "/verifyemail";

  if (isPublicPath && token?.length !== 0) {
    // If the user is already logged in, redirect to the home page
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (!isPublicPath && !token) {
    // If the user is not logged in and trying to access a protected route, redirect to the sign-in page
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  // Allow access to the requested route
  return NextResponse.next();
}

// Define which paths the middleware should apply to
export const config = {
  matcher: ["/", "/sign-in", "/sign-up", "/profile", "/verifyemail"], // Apply middleware to these paths
};
