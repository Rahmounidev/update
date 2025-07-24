import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // R�cup�rer toutes les cuisines dans la base de donn�es
    const cuisines = await prisma.cuisine.findMany();

    // V�rifier si des cuisines existent et r�pondre avec les donn�es
    if (cuisines.length > 0) {
      res.status(200).json({ success: true, data: cuisines });
    } else {
      res.status(404).json({ success: false, message: "Aucune cuisine trouv�e" });
    }
  } catch (error) {
    // G�rer les erreurs
    console.error("Erreur lors du chargement des cuisines:", error);
    res.status(500).json({ success: false, message: "Erreur serveur" });
  }
}
