import type { NextApiRequest, NextApiResponse } from "next"
import { getIronSession } from "iron-session"
import { sessionOptions, type SessionData } from "@/lib/session"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Méthode non autorisée" })
  }

  try {
    const session = await getIronSession<SessionData>(req, res, sessionOptions)

    session.destroy()

    console.log("✅ Déconnexion réussie")
    res.status(200).json({ message: "Déconnexion réussie" })
  } catch (error) {
    console.error("❌ Erreur lors de la déconnexion:", error)
    res.status(500).json({ message: "Erreur lors de la déconnexion" })
  }
}
