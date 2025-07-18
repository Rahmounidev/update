import type { NextApiRequest, NextApiResponse } from "next"
import { getIronSession } from "iron-session"
import { sessionOptions, SessionData } from "@/lib/session"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Cast session en SessionData pour accéder à tes propriétés personnalisées
  const session = (await getIronSession(req, res, sessionOptions)) as SessionData

  if (!session || !session.isLoggedIn) {
    return res.status(401).json({ message: "Non connecté" })
  }

  const responseData = {
    id: session.userType === "customer" ? session.customerId : session.userId,
    email: session.email,
    name: session.name,
    role: session.role,
    userType: session.userType,
  }

  return res.status(200).json(responseData)
}
