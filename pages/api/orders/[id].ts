import type { NextApiRequest, NextApiResponse } from "next"
import { getIronSession } from "iron-session"
import { prisma } from "@/lib/db"
import { sessionOptions, type SessionData } from "@/lib/session"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getIronSession<SessionData>(req, res, sessionOptions)

  if (!session.isLoggedIn || !session.userId) {
    return res.status(401).json({ message: "Non authentifié" })
  }

  const { id } = req.query

  if (req.method === "GET") {
    try {
      const order = await prisma.orders.findFirst({
        where: {
          id: id as string,
          customerId: session.userId,
        },
        include: {
          users: {
            select: {
              restaurantName: true,
              name: true,
              logo: true,
              phone: true,
              address: true,
            },
          },
          order_items: {
            include: {
              dishes: {
                select: {
                  name: true,
                  image: true,
                  description: true,
                },
              },
            },
          },
        },
      })

      if (!order) {
        return res.status(404).json({ message: "Commande non trouvée" })
      }

      res.status(200).json({ order })
    } catch (error) {
      console.error("Get order error:", error)
      res.status(500).json({ message: "Erreur lors de la récupération de la commande" })
    }
  } else if (req.method === "PATCH") {
    try {
      // Seule l'annulation est autorisée pour les clients
      const { status } = req.body

      if (status !== "CANCELLED") {
        return res.status(403).json({ message: "Action non autorisée" })
      }

      const order = await prisma.orders.findFirst({
        where: {
          id: id as string,
          customerId: session.userId,
        },
      })

      if (!order) {
        return res.status(404).json({ message: "Commande non trouvée" })
      }

      if (order.status !== "PENDING") {
        return res.status(400).json({
          message: "Seules les commandes en attente peuvent être annulées",
        })
      }

      const updatedOrder = await prisma.orders.update({
        where: { id: id as string },
        data: { status: "CANCELLED" },
      })

      res.status(200).json({
        message: "Commande annulée avec succès",
        order: updatedOrder,
      })
    } catch (error) {
      console.error("Update order error:", error)
      res.status(500).json({ message: "Erreur lors de la mise à jour de la commande" })
    }
  } else {
    res.status(405).json({ message: "Method not allowed" })
  }
}
