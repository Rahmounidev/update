import type { NextApiRequest, NextApiResponse } from "next"
import { getIronSession } from "iron-session"
import { prisma } from "@/lib/db"
import { sessionOptions, type SessionData } from "@/lib/session"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" })
  }

  const session = await getIronSession<SessionData>(req, res, sessionOptions)

  if (!session.isLoggedIn || !session.userId) {
    return res.status(401).json({ message: "Non authentifié" })
  }

  try {
    const [totalOrders, totalSpent, favoriteRestaurant, recentOrders, ordersByStatus] = await Promise.all([
      // Total des commandes
      prisma.orders.count({
        where: { customerId: session.userId },
      }),

      // Total dépensé
      prisma.orders.aggregate({
        where: {
          customerId: session.userId,
          status: { not: "CANCELLED" },
        },
        _sum: { totalAmount: true },
      }),

      // Restaurant favori (le plus commandé)
      prisma.orders.groupBy({
        by: ["userId"],
        where: { customerId: session.userId },
        _count: { id: true },
        orderBy: { _count: { id: "desc" } },
        take: 1,
      }),

      // Commandes récentes
      prisma.orders.findMany({
        where: { customerId: session.userId },
        include: {
          users: {
            select: {
              restaurantName: true,
              name: true,
              logo: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),

      // Commandes par statut
      prisma.orders.groupBy({
        by: ["status"],
        where: { customerId: session.userId },
        _count: { id: true },
      }),
    ])

    // Récupérer les détails du restaurant favori
    let favoriteRestaurantDetails = null
    if (favoriteRestaurant.length > 0) {
      favoriteRestaurantDetails = await prisma.users.findUnique({
        where: { id: favoriteRestaurant[0].userId },
        select: {
          id: true,
          restaurantName: true,
          name: true,
          logo: true,
          cuisine: {
            select: {
              name: true,
            },
          },      
          },
      })
    }

    res.status(200).json({
      stats: {
        totalOrders,
        totalSpent: totalSpent._sum.totalAmount || 0,
        favoriteRestaurant: favoriteRestaurantDetails
          ? {
              ...favoriteRestaurantDetails,
              orderCount: favoriteRestaurant[0]._count.id,
            }
          : null,
        ordersByStatus: ordersByStatus.reduce(
          (acc, item) => {
            acc[item.status] = item._count.id
            return acc
          },
          {} as Record<string, number>,
        ),
      },
      recentOrders: recentOrders.map((order) => ({
        id: order.id,
        orderNumber: order.orderNumber,
        status: order.status,
        totalAmount: order.totalAmount,
        createdAt: order.createdAt,
        restaurant: {
          name: order.users.restaurantName || order.users.name,
          logo: order.users.logo,
        },
      })),
    })
  } catch (error) {
    console.error("Dashboard stats error:", error)
    res.status(500).json({ message: "Erreur lors de la récupération des statistiques" })
  }
}
