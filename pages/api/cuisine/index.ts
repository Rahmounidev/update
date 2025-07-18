// /pages/api/cuisine/index.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ success: false, message: "Méthode non autorisée" });
  }

  try {
    const cuisines = await prisma.cuisine.findMany({
      orderBy: { name: "asc" },
    });

    return res.status(200).json({
      success: true,
      data: cuisines,
    });
  } catch (error) {
    console.error("Erreur récupération des cuisines :", (error as Error).message);

    return res.status(500).json({
      success: false,
      message: "Erreur serveur lors de la récupération des cuisines",
    });
  }
}
