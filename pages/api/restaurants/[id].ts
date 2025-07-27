import type { NextApiRequest, NextApiResponse } from "next"
import { prisma } from "@/lib/prisma"  

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" })
  }

  const { id } = req.query
  if (!id || typeof id !== "string") {
    return res.status(400).json({ message: "ID invalide" })
  }

  try {
    const now = new Date()

    const restaurant = await prisma.users.findUnique({
      where: { id },
      include: {
        dishes: {
          where: { isAvailable: true },
          include: { categories: true },
          orderBy: { name: "asc" },
        },
        reviews: {
          where: { isVisible: true },
          include: {
            customers: { select: { name: true } },
          },
          orderBy: { createdAt: "desc" },
          take: 10,
        },
        promotions: {
          where: {
            isActive: true,
            startDate: { lte: now },
            endDate: { gte: now },
          },
          select: {
            id: true,
            name: true,
            description: true,
            type: true,
            value: true,
            code: true,
          },
        },
        cuisine: { select: { id: true, name: true } }, 
      },
    })

    if (!restaurant || restaurant.role !== "RESTAURANT" || !restaurant.isActive) {
      return res.status(404).json({ message: "Restaurant non trouvé" })
    }

    
    const ratings = restaurant.reviews.map(r => r.rating)
    const averageRating = ratings.length > 0 ? ratings.reduce((sum, r) => sum + r, 0) / ratings.length : 0

   
    const categoriesMap = new Map<string, any>()
    restaurant.dishes.forEach(dish => {
      const categoryName = dish.categories?.name || "Autres"
      if (!categoriesMap.has(categoryName)) {
        categoriesMap.set(categoryName, {
          id: dish.categories?.id,
          name: categoryName,
          dishes: [],
        })
      }
      categoriesMap.get(categoryName).dishes.push({
        id: dish.id,
        name: dish.name,
        description: dish.description,
        price: dish.price,
        image: dish.image,
        preparationTime: dish.preparationTime,
        ingredients: dish.ingredients,
        allergens: dish.allergens,
        calories: dish.calories,
        isVegetarian: dish.isVegetarian,
        isVegan: dish.isVegan,
        isGlutenFree: dish.isGlutenFree,
      })
    })

    const menu = Array.from(categoriesMap.values())

    return res.status(200).json({
      restaurant: {
        id: restaurant.id,
        restaurantName: restaurant.restaurantName,
        name: restaurant.name,
        description: restaurant.description,
        logo: restaurant.logo,
        cuisines: restaurant.cuisine.map(c => ({ id: c.id, name: c.name })),
        city: restaurant.city,
        address: restaurant.address,
        phone: restaurant.phone,
        hours: restaurant.hours,
        isOpen: restaurant.isOpen,
        minimumOrder: restaurant.minimumOrder,
        deliveryRadius: restaurant.deliveryRadius,
        customMessage: restaurant.customMessage,
        averageRating: Math.round(averageRating * 10) / 10,
        reviewCount: ratings.length,
        menu,
        reviews: restaurant.reviews.map(review => ({
          id: review.id,
          rating: review.rating,
          comment: review.comment,
          response: review.response,
          createdAt: review.createdAt,
          customerName: review.customers?.name,
        })),
        promotions: restaurant.promotions,
      },
    })
  } catch (error) {
    console.error("Restaurant detail error:", error)
    return res.status(500).json({ message: "Erreur lors de la récupération du restaurant" })
  }
}
