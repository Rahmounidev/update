import type { NextApiRequest, NextApiResponse } from "next";
import { getIronSession } from "iron-session";
import { prisma } from "@/lib/db";
import { sessionOptions, type SessionData, validateSession } from "@/lib/session";

// Liste des récompenses disponibles
const availableRewards = [
  { id: "1", name: "Livraison gratuite", pointsCost: 100 },
  { id: "2", name: "Réduction 10%", pointsCost: 200 },
  { id: "3", name: "Pizza gratuite", pointsCost: 400 },
  { id: "4", name: "Cashback 50 DH", pointsCost: 500 },
  { id: "5", name: "Réduction 20%", pointsCost: 600 },
];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Méthode non autorisée" });
  }

  try {
    const session = await getIronSession<SessionData>(req, res, sessionOptions);

    if (!validateSession(session) || !session.customerId || session.userType !== "customer") {
      return res.status(401).json({ message: "Non authentifié" });
    }

    const { rewardId } = req.body;

    if (!rewardId) {
      return res.status(400).json({ message: "rewardId manquant" });
    }

    const reward = availableRewards.find((r) => r.id === rewardId);
    if (!reward) {
      return res.status(404).json({ message: "Récompense non trouvée" });
    }

    // Récupérer les points actuels 
    const loyalty = await prisma.loyalty_points.findUnique({
      where: { customerId: session.customerId },
    });

    if (!loyalty || loyalty.current < reward.pointsCost) {
      return res.status(400).json({ message: "Points insuffisants" });
    }

    const updatedLoyalty = await prisma.loyalty_points.update({
      where: { customerId: session.customerId },
      data: {
        current: { decrement: reward.pointsCost },
      },
    });

    await prisma.loyalty_transactions.create({
      data: {
        customerId: session.customerId,
        type: "redeemed",
        points: reward.pointsCost,
        description: `Échange : ${reward.name}`,
        date: new Date(),
      },
    });

    return res.status(200).json({
      message: "Récompense échangée avec succès",
      currentPoints: updatedLoyalty.current,
    });
  } catch (error) {
    console.error("❌ [LOYALTY_REDEEM_ERROR]", error);
    return res.status(500).json({ message: "Erreur interne du serveur" });
  }
}
