import type { NextApiRequest, NextApiResponse } from "next"
import { prisma, testConnection } from "@/lib/db"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Méthode non autorisée" })
  }

  try {
    console.log("🔍 Test de connexion à la base de données...")

   
    const isConnected = await testConnection()

    if (!isConnected) {
      return res.status(500).json({
        success: false,
        message: "Impossible de se connecter à la base de données",
        timestamp: new Date().toISOString(),
      })
    }

    const customerCount = await prisma.customers.count()
    const userCount = await prisma.users.count()
    const categoryCount = await prisma.categories.count()

    console.log("✅ Test de base de données réussi")

    res.status(200).json({
      success: true,
      message: "Connexion à la base de données réussie",
      data: {
        customers: customerCount,
        users: userCount,
        categories: categoryCount,
      },
      timestamp: new Date().toISOString(),
    })
  } catch (error: any) {
    console.error("❌ Erreur lors du test de base de données:", error)

    res.status(500).json({
      success: false,
      message: "Erreur lors du test de base de données",
      error: process.env.NODE_ENV === "development" ? error.message : "Erreur interne",
      timestamp: new Date().toISOString(),
    })
  }
}
