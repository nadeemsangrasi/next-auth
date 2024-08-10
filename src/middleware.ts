import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = cookies().get("token"); // Replace with your authentication logic

  // Check if the request is for a page that should not be redirected
  if (
    !token &&
    !request.nextUrl.pathname.startsWith("/sign-in") &&
    !request.nextUrl.pathname.startsWith("/sign-up")
  ) {
    // Redirect to login if the token is not present
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  return NextResponse.next();
}

// Define which paths the middleware should apply to
export const config = {
  matcher: ["/profile", "/verifyemail"], // Apply middleware to these paths
};
