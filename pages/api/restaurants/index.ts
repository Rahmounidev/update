import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { cuisine, search, isOpen, minRating } = req.query;

    const filters: any = {
      role: "RESTAURANT",
      isActive: true,
    };

    if (isOpen === "true") {
      filters.isOpen = true;
    }

    if (cuisine && cuisine !== "Tous") {
      filters.cuisine = {
        some: {
          name: { contains: String(cuisine) }, 
        },
      };
    }

    if (minRating) {
      filters.reviews = {
        some: {
          rating: { gte: parseFloat(minRating as string) },
        },
      };
    }

    if (search) {
      filters.OR = [
        { restaurantName: { contains: String(search) } },
        { description: { contains: String(search) } },
        { cuisine: { some: { name: { contains: String(search) } } } }, 
      ];
    }

    const restaurantsRaw = await prisma.users.findMany({
      where: filters,
      select: {
        id: true,
        restaurantName: true,
        name: true,
        description: true,
        logo: true,
        city: true,
        address: true,
        phone: true,
        hours: true,
        isOpen: true,
        minimumOrder: true,
        deliveryRadius: true,
        customMessage: true,
        cuisine: {
          select: { name: true },
        },
        promotions: {
          where: { isActive: true },
          select: { name: true },
        },
        reviews: {
          select: { rating: true },
        },
        dishes: {
          where: { isAvailable: true },
          select: { id: true, name: true, price: true, image: true },
          take: 3,
        },
      },
    });

    
    const restaurants = restaurantsRaw.map((restaurant) => {
      const ratings = restaurant.reviews.map((r) => r.rating);
      const averageRating =
        ratings.length > 0
          ? Math.round((ratings.reduce((sum, r) => sum + r, 0) / ratings.length) * 10) / 10
          : 0;

      return {
        ...restaurant,
        averageRating,
        reviewCount: ratings.length,
      };
    });

    res.status(200).json({ restaurants });
  } catch (error) {
    console.error("Restaurants error:", error);
    res.status(500).json({ message: "Erreur lors de la récupération des restaurants" });
  }
}
