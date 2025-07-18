import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const SESSION_COOKIE_NAME = "droovo-session"

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME)?.value

  // Définir les routes publiques
  const isAuthPath = ["/login", "/register"].some((path) =>
    pathname.startsWith(path)
  )

  const hasSession = Boolean(sessionCookie && sessionCookie !== "")

  // Redirection si l'utilisateur NON connecté essaie d'accéder à une page protégée
  if (!hasSession && !isAuthPath) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // Redirection si l'utilisateur connecté essaie d'accéder à /login ou /register
  if (hasSession && isAuthPath) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api).*)"],
}
