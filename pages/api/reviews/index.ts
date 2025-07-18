import type { NextApiRequest, NextApiResponse } from "next"
import { getIronSession } from "iron-session"
import { prisma } from "@/lib/db"
import { createReviewSchema } from "@/lib/validations/review"
import { sessionOptions, type SessionData } from "@/lib/session"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" })
  }

  const session = await getIronSession<SessionData>(req, res, sessionOptions)

  if (!session.isLoggedIn || !session.userId) {
    return res.status(401).json({ message: "Non authentifié" })
  }

  try {
    const validatedData = createReviewSchema.parse(req.body)
    const { rating, comment, userId: restaurantId } = validatedData

    // Vérifier que le client a bien commandé dans ce restaurant
    const hasOrdered = await prisma.orders.findFirst({
      where: {
        customerId: session.userId,
        userId: restaurantId,
        status: "DELIVERED",
      },
    })

    if (!hasOrdered) {
      return res.status(403).json({
        message: "Vous devez avoir commandé dans ce restaurant pour laisser un avis",
      })
    }

    // Vérifier qu'il n'y a pas déjà un avis de ce client pour ce restaurant
    const existingReview = await prisma.reviews.findFirst({
      where: {
        customerId: session.userId,
        userId: restaurantId,
      },
    })

    if (existingReview) {
      return res.status(400).json({
        message: "Vous avez déjà laissé un avis pour ce restaurant",
      })
    }

    const review = await prisma.reviews.create({
      data: {
        rating,
        comment,
        customerId: session.userId,
        userId: restaurantId,
      },
      include: {
        customers: {
          select: {
            name: true,
          },
        },
      },
    })

    res.status(201).json({
      message: "Avis créé avec succès",
      review: {
        id: review.id,
        rating: review.rating,
        comment: review.comment,
        createdAt: review.createdAt,
        customerName: review.customers.name,
      },
    })
  } catch (error: any) {
    console.error("Create review error:", error)

    if (error.name === "ZodError") {
      return res.status(400).json({ message: "Données invalides", errors: error.errors })
    }

    res.status(500).json({ message: "Erreur lors de la création de l'avis" })
  }
}
