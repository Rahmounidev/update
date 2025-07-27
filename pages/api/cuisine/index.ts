import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
  
    const cuisines = await prisma.cuisine.findMany();

   
    if (cuisines.length > 0) {
      res.status(200).json({ success: true, data: cuisines });
    } else {
      res.status(404).json({ success: false, message: "Aucune cuisine trouv�e" });
    }
  } catch (error) {
    // Gerer les erreurs
    console.error("Erreur lors du chargement des cuisines:", error);
    res.status(500).json({ success: false, message: "Erreur serveur" });
  }
}
