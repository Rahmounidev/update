import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma"; // Assurez-vous que le chemin vers votre fichier prisma est correct

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { cuisine, search, isOpen, minRating } = req.query;

    // Initialiser les filtres de recherche
    const filters: any = {
      role: "RESTAURANT",
      isActive: true, // Filtrer uniquement les restaurants actifs
    };

    // Filtrer par restaurants ouverts
    if (isOpen === "true") {
      filters.isOpen = true;
    }

    // Filtrer par cuisine spécifique
    if (cuisine && cuisine !== "Tous") {
      filters.cuisines = {
        some: {
          name: {
            contains: String(cuisine),
            // mode: "insensitive", // supprimé car non supporté
          },
        },
      };
    }

    // Filtrer par évaluation minimale
    if (minRating) {
      filters.reviews = {
        some: {
          rating: {
            gte: parseFloat(minRating as string), // Convertir la note minimale en nombre
          },
        },
      };
    }

    // Filtrer par recherche de texte (nom, cuisine, description)
    if (search) {
      filters.OR = [
        { restaurantName: { contains: String(search) /* , mode: "insensitive" supprimé */ } },
        { description: { contains: String(search) /* , mode: "insensitive" supprimé */ } },
        { cuisines: { some: { name: { contains: String(search) /* , mode: "insensitive" supprimé */ } } } },
      ];
    }

    // Recherche des restaurants en fonction des filtres
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
            name: true,
          },
        },
        reviews: {
          select: {
            rating: true,
          },
        },
        dishes: {
          where: {
            isAvailable: true, // Filtrer les plats disponibles
          },
          select: {
            id: true,
            name: true,
            price: true,
            image: true,
          },
          take: 3, // Limiter à 3 plats
        },
      },
    });

    // Retourner les restaurants filtrés
    res.status(200).json({ restaurants });
  } catch (error) {
    console.error("Restaurants error:", error);
    res.status(500).json({
      message: "Erreur lors de la récupération des restaurants",
    });
  }
}
