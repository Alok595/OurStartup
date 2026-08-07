export { default } from "next-auth/middleware";

export const config = {
  // Apply middleware only to the protected admin routes
  matcher: ["/dashboard/:path*", "/users/:path*", "/portfolio/:path*", "/settings/:path*"],
};
