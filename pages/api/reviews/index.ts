import type { NextApiRequest, NextApiResponse } from "next";
import { getIronSession } from "iron-session";
import { prisma } from "@/lib/db";
import { createReviewSchema } from "@/lib/validations/review";
import { sessionOptions, type SessionData } from "@/lib/session";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log("🔍 API /api/reviews appelé avec la méthode:", req.method);

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const session = await getIronSession<SessionData>(req, res, sessionOptions);
  console.log("📦 Session récupérée:", session);

  const currentUserId = session.customerId || session.userId;
  if (!session.isLoggedIn || !currentUserId) {
    return res.status(401).json({ message: "Non authentifié" });
  }

  try {
    console.log("📥 Corps de la requête:", req.body);

    const validatedData = createReviewSchema.parse(req.body);
    const { rating, comment, userId: restaurantId } = validatedData;

    console.log("✅ Données validées:", validatedData);

    // Ici on ne vérifie ni les commandes ni les avis existants

    // Crée l'avis directement
    const review = await prisma.reviews.create({
      data: {
        rating,
        comment,
        customerId: currentUserId,
        userId: restaurantId,
      },
      include: {
        customers: {
          select: {
            name: true,
          },
        },
      },
    });

    console.log("🎉 Avis créé:", review);

    return res.status(201).json({
      message: "Avis créé avec succès",
      review: {
        id: review.id,
        rating: review.rating,
        comment: review.comment,
        createdAt: review.createdAt,
        customerName: review.customers.name,
      },
    });
  } catch (error: any) {
    console.error("❌ Erreur API /api/reviews:", error);

    if (error.name === "ZodError") {
      return res.status(400).json({ message: "Données invalides", errors: error.errors });
    }

    return res.status(500).json({ message: "Erreur lors de la création de l'avis" });
  }
}
