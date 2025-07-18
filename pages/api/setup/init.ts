import type { NextApiRequest, NextApiResponse } from "next"
import { prisma } from "@/lib/db"
import { createDefaultRoles, hashPassword } from "@/lib/auth"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Méthode non autorisée" })
  }

  try {
    console.log("🚀 Initialisation de l'application...")

    // Créer les rôles par défaut
    await createDefaultRoles()

    // Créer un admin par défaut
    const adminEmail = "admin@droovo.com"
    const adminPassword = "admin123"

    const existingAdmin = await prisma.users.findUnique({
      where: { email: adminEmail },
    })

    if (!existingAdmin) {
      const hashedPassword = await hashPassword(adminPassword)

      const admin = await prisma.users.create({
        data: {
          email: adminEmail,
          password: hashedPassword,
          name: "Administrateur",
          role: "ADMIN",
          restaurantName: "Droovo Admin",
        },
      })

      // Assigner le rôle admin
      const adminRole = await prisma.roles.findUnique({
        where: { name: "ADMIN" },
      })

      if (adminRole) {
        await prisma.user_roles.create({
          data: {
            userId: admin.id,
            roleId: adminRole.id,
          },
        })
      }

      console.log("✅ Administrateur créé:", adminEmail)
    }

    // Créer des catégories par défaut
    const defaultCategories = [
      { name: "Entrées", description: "Plats d'entrée" },
      { name: "Plats principaux", description: "Plats de résistance" },
      { name: "Desserts", description: "Desserts et sucreries" },
      { name: "Boissons", description: "Boissons chaudes et froides" },
    ]

    for (const category of defaultCategories) {
      await prisma.categories.upsert({
        where: { name: category.name },
        update: {},
        create: category,
      })
      
    }

    console.log("✅ Catégories par défaut créées")

    res.status(200).json({
      success: true,
      message: "Initialisation terminée avec succès",
      data: {
        adminEmail,
        adminPassword,
        categoriesCreated: defaultCategories.length,
      },
    })
  } catch (error: any) {
    console.error("❌ Erreur lors de l'initialisation:", error)
    res.status(500).json({
      success: false,
      message: "Erreur lors de l'initialisation",
      error: process.env.NODE_ENV === "development" ? error.message : "Erreur interne",
    })
  }
}
