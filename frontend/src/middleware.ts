import { type MiddlewareConfig, NextRequest, NextResponse } from "next/server";

const publicRoutes = [
  { path: "/login", whenAuthenticated: "redirect" },
  { path: "/register", whenAuthenticated: "redirect" },
  { path: "/verify", whenAuthenticated: "next" },
  { path: "/reset-password", whenAuthenticated: "next" },
  { path: "/forgot-password", whenAuthenticated: "next" },
];

const REDIRECT_WHEN_NOT_AUTHENTICATED_ROUTE = "/login";

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const cleanPath = path.split("?")[0].trim();
  const publicRoute = publicRoutes.find((route) => {
    return route.path.trim() === cleanPath;
  });
  const token = request.cookies.get("simulaia.token")?.value;

  if (!token && publicRoute) {
    return NextResponse.next();
  }
  if (!token && !publicRoute) {
    const redirectURL = request.nextUrl.clone();
    redirectURL.pathname = REDIRECT_WHEN_NOT_AUTHENTICATED_ROUTE;
    return NextResponse.redirect(redirectURL);
  }
  if (token && publicRoute && publicRoute.whenAuthenticated === "redirect") {
    const redirectURL = request.nextUrl.clone();
    redirectURL.pathname = "/dashboard";
    return NextResponse.redirect(redirectURL);
  }
  if (token && !publicRoute) {
    try {
      const tokenPayload = JSON.parse(
        Buffer.from(token.split(".")[1], "base64").toString()
      );
      const expirationDate = new Date(tokenPayload.exp * 1000);
      if (expirationDate < new Date()) {
        const redirectURL = request.nextUrl.clone();
        redirectURL.pathname = REDIRECT_WHEN_NOT_AUTHENTICATED_ROUTE;
        const response = NextResponse.redirect(redirectURL);
        response.cookies.delete("simulaia.token");
        return response;
      }
    } catch {
      const redirectURL = request.nextUrl.clone();
      redirectURL.pathname = REDIRECT_WHEN_NOT_AUTHENTICATED_ROUTE;
      const response = NextResponse.redirect(redirectURL);
      response.cookies.delete("simulaia.token");
      return response;
    }
  }
}

export const config: MiddlewareConfig = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
