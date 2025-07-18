import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { cuisine, isOpen, minRating } = req.query;

    const filters: any = {
      role: "RESTAURANT",
      isActive: true,
    };

    if (isOpen === "true") {
      filters.isOpen = true;
    }

    if (cuisine) {
      filters.cuisines = {
        some: {
          name: {
            equals: cuisine as string,
          },
        },
      };
    }

    if (minRating) {
      filters.reviews = {
        some: {
          rating: {
            gte: parseFloat(minRating as string),
          },
        },
      };
    }

    const restaurants = await prisma.users.findMany({
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
        cuisines: {
          select: {
            name: true,
          },
        },
        promotions: {
          where: {
            isActive: true,
          },
          select: {
            name: true, // ✅ champ correct dans le modèle "promotions"
          },
        },
        reviews: {
          select: {
            rating: true,
          },
        },
        dishes: {
          where: {
            isAvailable: true,
          },
          select: {
            id: true,
            name: true,
            price: true,
            image: true,
          },
          take: 3,
        },
      },
    });

    res.status(200).json({ restaurants });
  } catch (error) {
    console.error("Restaurants error:", error);
    res.status(500).json({ message: "Erreur lors de la récupération des restaurants" });
  }
}
