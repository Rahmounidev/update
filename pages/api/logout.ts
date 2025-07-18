import { getIronSession } from "iron-session"
import { sessionOptions, type SessionData } from "@/lib/session"
import type { NextApiRequest, NextApiResponse } from "next"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getIronSession<SessionData>(req, res, sessionOptions)
  await session.destroy()
  res.writeHead(302, { Location: "/login" })
  res.end()
}
