import NextAuth from "next-auth";
import authConfig from "@/auth.config";

const { auth } = NextAuth(authConfig);

const isProtectedRoute = (pathname: string) => {
  return pathname.startsWith("/dashboard");
};

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const { nextUrl } = req;

  if (isProtectedRoute(nextUrl.pathname)) {
    if (!isLoggedIn) {
      return Response.redirect(new URL("/sign-in", nextUrl));
    }
  }

  return null;
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};