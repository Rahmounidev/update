import type { SessionOptions } from "iron-session"

export interface SessionData {
  userId?: string
  customerId?: string
  email?: string
  name?: string
  role?: string
  isLoggedIn: boolean
  userType?: "user" | "customer"
}

export const defaultSession: SessionData = {
  isLoggedIn: false,
}

export const sessionOptions: SessionOptions = {
  password: process.env.SESSION_PASSWORD!,
  cookieName: "droovo-session",
  cookieOptions: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 jours
  },
}

export function validateSession(session: SessionData): boolean {
  return session.isLoggedIn && (!!session.userId || !!session.customerId)
}
