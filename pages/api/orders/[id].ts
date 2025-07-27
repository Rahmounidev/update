import type { NextApiRequest, NextApiResponse } from "next"
import { getIronSession } from "iron-session"
import { prisma } from "@/lib/db"
import { sessionOptions, type SessionData } from "@/lib/session"
import { z } from "zod"

const reviewSchema = z.object({
  rating: z.number().min(1).max(5),
  comment: z.string().optional(),
})

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log("🔍 API /api/orders/[id] appelé avec la méthode:", req.method)

  const session = await getIronSession<SessionData>(req, res, sessionOptions)
  const currentUserId = session.customerId

  if (!session.isLoggedIn || !currentUserId) {
    return res.status(401).json({ message: "Non authentifié" })
  }

  const orderId = req.query.id as string
  if (!orderId) {
    return res.status(400).json({ message: "ID de commande manquant" })
  }

  try {
    // --- GET : Récupérer la commande ---
    if (req.method === "GET") {
      const order = await prisma.orders.findUnique({
        where: { id: orderId },
        include: {
          users: { select: { restaurantName: true } }, // Inclure le nom du restaurant
        },
      })

      if (!order) {
        return res.status(404).json({ message: "Commande introuvable" })
      }

      if (order.customerId !== currentUserId) {
        return res.status(403).json({ message: "Accès refusé à cette commande" })
      }

      // Calcul du temps estimé
      let estimatedTime: string | null = null
      if (order.deliveryTime) {
        estimatedTime = new Date(order.deliveryTime).toLocaleTimeString()
      } else {
        const estimated = new Date(order.createdAt)
        estimated.setMinutes(estimated.getMinutes() + 30) // 30 min par défaut
        estimatedTime = estimated.toLocaleTimeString()
      }

      return res.status(200).json({
        orderId: order.id,
        status: order.status, // PENDING, CONFIRMED, PREPARING, READY, DELIVERED
        restaurantName: order.users?.restaurantName || "Restaurant",
        estimatedTime,
      })
    }

    // --- POST : Ajouter un avis ---
    if (req.method === "POST") {
      const { rating, comment } = reviewSchema.parse(req.body)

      const order = await prisma.orders.findUnique({
        where: { id: orderId },
        select: { id: true, customerId: true, userId: true, status: true },
      })

      if (!order) {
        return res.status(404).json({ message: "Commande introuvable" })
      }

      if (order.customerId !== currentUserId) {
        return res.status(403).json({ message: "Accès refusé à cette commande" })
      }

      if (order.status !== "DELIVERED") {
        return res.status(400).json({ message: "Impossible de noter une commande non livrée" })
      }

      const existingReview = await prisma.reviews.findFirst({
        where: { customerId: currentUserId, userId: order.userId },
      })

      if (existingReview) {
        return res.status(400).json({ message: "Vous avez déjà laissé un avis pour ce restaurant." })
      }

      const review = await prisma.reviews.create({
        data: {
          rating,
          comment: comment || null,
          customerId: currentUserId,
          userId: order.userId,
        },
      })

      return res.status(201).json({ message: "Avis enregistré avec succès", review })
    }

    return res.status(405).json({ message: "Method not allowed" })
  } catch (error: any) {
    console.error("❌ Erreur API /api/orders/[id]:", error)
    if (error.name === "ZodError") {
      return res.status(400).json({ message: "Données invalides", errors: error.errors })
    }
    return res.status(500).json({ message: "Erreur serveur" })
  }
}
