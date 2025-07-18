import type { NextApiRequest, NextApiResponse } from "next"
import { getIronSession } from "iron-session"
import { prisma } from "@/lib/db"
import { createOrderSchema } from "@/lib/validations/order"
import { sessionOptions, type SessionData } from "@/lib/session"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getIronSession<SessionData>(req, res, sessionOptions)

  if (!session.isLoggedIn || !session.userId) {
    return res.status(401).json({ message: "Non authentifié" })
  }

  if (req.method === "GET") {
    try {
      const orders = await prisma.orders.findMany({
        where: { customerId: session.userId },
        include: {
          users: {
            select: {
              restaurantName: true,
              name: true,
              logo: true,
            },
          },
          order_items: {
            include: {
              dishes: {
                select: {
                  name: true,
                  image: true,
                },
              },
            },
          },
        },
        orderBy: { createdAt: "desc" },
      })

      res.status(200).json({ orders })
    } catch (error) {
      console.error("Get orders error:", error)
      res.status(500).json({ message: "Erreur lors de la récupération des commandes" })
    }
  } else if (req.method === "POST") {
    try {
      const validatedData = createOrderSchema.parse(req.body)
      const { items, deliveryAddress, notes, paymentMethod } = validatedData

      // Vérifier que tous les plats existent et calculer le total
      let totalAmount = 0
      const dishesData = []

      for (const item of items) {
        const dish = await prisma.dishes.findUnique({
          where: { id: item.dishId },
          include: { users: true },
        })

        if (!dish || !dish.isAvailable) {
          return res.status(400).json({
            message: `Le plat ${item.dishId} n'est pas disponible`,
          })
        }

        dishesData.push({
          ...item,
          dish,
          subtotal: dish.price * item.quantity,
        })

        totalAmount += dish.price * item.quantity
      }

      // Vérifier que tous les plats viennent du même restaurant
      const restaurantIds = [...new Set(dishesData.map((item) => item.dish.userId))]
      if (restaurantIds.length > 1) {
        return res.status(400).json({
          message: "Tous les plats doivent venir du même restaurant",
        })
      }

      const restaurantId = restaurantIds[0]

      // Générer un numéro de commande unique
      const orderNumber = `CMD-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${Date.now().toString().slice(-6)}`

      // Créer la commande
      const order = await prisma.orders.create({
        data: {
          orderNumber,
          customerId: session.userId,
          userId: restaurantId,
          totalAmount,
          deliveryAddress,
          notes,
          paymentMethod,
          order_items: {
            create: dishesData.map((item) => ({
              dishId: item.dishId,
              quantity: item.quantity,
              price: item.dish.price,
              notes: item.notes,
            })),
          },
        },
        include: {
          order_items: {
            include: {
              dishes: true,
            },
          },
          users: {
            select: {
              restaurantName: true,
              name: true,
            },
          },
        },
      })

      res.status(201).json({
        message: "Commande créée avec succès",
        order,
      })
    } catch (error: any) {
      console.error("Create order error:", error)

      if (error.name === "ZodError") {
        return res.status(400).json({ message: "Données invalides", errors: error.errors })
      }

      res.status(500).json({ message: "Erreur lors de la création de la commande" })
    }
  } else {
    res.status(405).json({ message: "Method not allowed" })
  }
}
