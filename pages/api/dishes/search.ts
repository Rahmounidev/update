import type { NextApiRequest, NextApiResponse } from "next"
import { prisma } from "@/lib/db"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" })
  }

  try {
    const {
      q,
      categoryId,
      minPrice,
      maxPrice,
      isVegetarian,
      isVegan,
      isGlutenFree,
      restaurantId,
      page = "1",
      limit = "20",
    } = req.query

    const pageNum = Number.parseInt(page as string)
    const limitNum = Number.parseInt(limit as string)
    const skip = (pageNum - 1) * limitNum

    const where: any = {
      isAvailable: true,
    }

    if (q) {
      where.OR = [{ name: { contains: q as string } }, { description: { contains: q as string } }]
    }

    if (categoryId) {
      where.categoryId = categoryId
    }

    if (minPrice || maxPrice) {
      where.price = {}
      if (minPrice) where.price.gte = Number.parseFloat(minPrice as string)
      if (maxPrice) where.price.lte = Number.parseFloat(maxPrice as string)
    }

    if (isVegetarian === "true") {
      where.isVegetarian = true
    }

    if (isVegan === "true") {
      where.isVegan = true
    }

    if (isGlutenFree === "true") {
      where.isGlutenFree = true
    }

    if (restaurantId) {
      where.userId = restaurantId
    }

    const [dishes, total] = await Promise.all([
      prisma.dishes.findMany({
        where,
        include: {
          categories: {
            select: {
              name: true,
            },
          },
          users: {
            select: {
              restaurantName: true,
              name: true,
              logo: true,
            },
          },
        },
        orderBy: { name: "asc" },
        skip,
        take: limitNum,
      }),
      prisma.dishes.count({ where }),
    ])

    res.status(200).json({
      dishes: dishes.map((dish) => ({
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
        category: dish.categories.name,
        restaurant: {
          id: dish.userId,
          name: dish.users.restaurantName || dish.users.name,
          logo: dish.users.logo,
        },
      })),
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    })
  } catch (error) {
    console.error("Search dishes error:", error)
    res.status(500).json({ message: "Erreur lors de la recherche de plats" })
  }
}
