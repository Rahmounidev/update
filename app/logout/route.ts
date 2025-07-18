import { NextResponse } from "next/server"
import { getIronSession } from "iron-session"
import { sessionOptions, type SessionData } from "@/lib/session"

export async function GET(request: Request) {
  const response = NextResponse.redirect(new URL("/login", request.url))

  const session = await getIronSession<SessionData>(request, response, sessionOptions)
  await session.destroy()

  return response
}
