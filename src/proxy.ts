import middleware from "next-auth/middleware";

export default function proxy(req: any, ctx: any) {
  return middleware(req, ctx);
}

export const config = {
  // Apply middleware only to the protected admin routes
  matcher: ["/dashboard/:path*", "/users/:path*", "/portfolio/:path*", "/settings/:path*"],
};
