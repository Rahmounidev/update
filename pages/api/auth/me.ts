import type { NextApiRequest, NextApiResponse } from "next"
import { getIronSession } from "iron-session"
import { prisma } from "@/lib/db"
import { sessionOptions, type SessionData, validateSession } from "@/lib/session"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Méthode non autorisée" })
  }

  try {
    const session = await getIronSession<SessionData>(req, res, sessionOptions)

    if (!validateSession(session)) {
      return res.status(401).json({ message: "Non authentifié" })
    }

    // Si c'est un client
    if (session.customerId && session.userType === "customer") {
      const customer = await prisma.customers.findUnique({
        where: { id: session.customerId },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          address: true,
          city: true,
          createdAt: true,
        },
      })

      if (!customer) {
        session.destroy()
        return res.status(401).json({ message: "Client non trouvé" })
      }

      return res.status(200).json({
        user: {
          ...customer,
          type: "customer",
          role: "CUSTOMER",
        },
      })
    }

    // Si c'est un utilisateur (restaurant/admin)
    if (session.userId && session.userType === "user") {
      const user = await prisma.users.findUnique({
        where: { id: session.userId },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          address: true,
          city: true,
          role: true,
          restaurantName: true,
          createdAt: true,
        },
      })

      if (!user) {
        session.destroy()
        return res.status(401).json({ message: "Utilisateur non trouvé" })
      }

      return res.status(200).json({
        user: {
          ...user,
          type: "user",
        },
      })
    }

    return res.status(401).json({ message: "Session invalide" })
  } catch (error) {
    console.error("❌ Erreur lors de la récupération de l'utilisateur:", error)
    res.status(500).json({ message: "Erreur interne du serveur" })
  }
}
