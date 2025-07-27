import type { NextApiRequest, NextApiResponse } from "next"
import { getIronSession } from "iron-session"
import  { prisma }  from "@/lib/prisma"
import { sessionOptions, type SessionData, validateSession } from "@/lib/session"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Méthode non autorisée" })
  }

  try {
    // Récupération session
    const session = await getIronSession<SessionData>(req, res, sessionOptions)

    if (!validateSession(session)) {
      return res.status(401).json({ message: "Non authentifié" })
    }

    // Supposons que le client est connecté
    if (session.customerId && session.userType === "customer") {
      // Récupérer points fidélité et transactions
      const points = await prisma.loyalty_points.findUnique({
        where: { customerId: session.customerId },
      })

      const transactions = await prisma.loyalty_transactions.findMany({
        where: { customerId: session.customerId },
        orderBy: { date: "desc" },
      })

      return res.status(200).json({
        currentPoints: points?.current || 0,
        totalEarned: points?.totalEarned || 0,
        transactions,
      })
    }

    // Si c'est un utilisateur (restaurant/admin) connecté, on peut retourner autre chose ou erreur :
    if (session.userId && session.userType === "user") {
      return res.status(403).json({ message: "Accès refusé aux utilisateurs non clients" })
    }

    return res.status(401).json({ message: "Session invalide" })
  } catch (error) {
    console.error("[LOYALTY_API_ERROR]", error)
    return res.status(500).json({ message: "Erreur interne du serveur" })
  }
}
