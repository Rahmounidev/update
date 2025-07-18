import type { NextApiRequest, NextApiResponse } from "next"
import { prisma } from "@/lib/db"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" })
  }

  try {
    const { id } = req.query
    const { page = "1", limit = "10" } = req.query

    const pageNum = Number.parseInt(page as string)
    const limitNum = Number.parseInt(limit as string)
    const skip = (pageNum - 1) * limitNum

    const [reviews, total] = await Promise.all([
      prisma.reviews.findMany({
        where: {
          userId: id as string,
          isVisible: true,
        },
        include: {
          customers: {
            select: {
              name: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limitNum,
      }),
      prisma.reviews.count({
        where: {
          userId: id as string,
          isVisible: true,
        },
      }),
    ])

    // Calculer les statistiques des avis
    const allReviews = await prisma.reviews.findMany({
      where: {
        userId: id as string,
        isVisible: true,
      },
      select: { rating: true },
    })

    const ratings = allReviews.map((r) => r.rating)
    const averageRating = ratings.length > 0 ? ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length : 0

    const ratingDistribution = {
      5: ratings.filter((r) => r === 5).length,
      4: ratings.filter((r) => r === 4).length,
      3: ratings.filter((r) => r === 3).length,
      2: ratings.filter((r) => r === 2).length,
      1: ratings.filter((r) => r === 1).length,
    }

    res.status(200).json({
      reviews: reviews.map((review) => ({
        id: review.id,
        rating: review.rating,
        comment: review.comment,
        response: review.response,
        createdAt: review.createdAt,
        customerName: review.customers.name,
      })),
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
      stats: {
        averageRating: Math.round(averageRating * 10) / 10,
        totalReviews: ratings.length,
        ratingDistribution,
      },
    })
  } catch (error) {
    console.error("Get restaurant reviews error:", error)
    res.status(500).json({ message: "Erreur lors de la récupération des avis" })
  }
}
