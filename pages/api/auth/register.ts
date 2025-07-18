import type { NextApiRequest, NextApiResponse } from "next"
import { getIronSession } from "iron-session"
import { prisma } from "@/lib/db"
import { registerSchema } from "@/lib/validations/auth"
import { sessionOptions, type SessionData } from "@/lib/session"
import { hashPassword } from "@/lib/auth"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Méthode non autorisée" })
  }

  try {
    console.log("🔍 Début de l'inscription...")
    console.log("📝 Données reçues:", req.body)

    const session = await getIronSession<SessionData>(req, res, sessionOptions)

    // Validation des données
    const validatedData = registerSchema.parse(req.body)
    const { firstName, lastName, email, password, phone } = validatedData

    console.log("✅ Données validées:", { firstName, lastName, email, phone })

    // Test de connexion à la base de données
    try {
      await prisma.$connect()
      console.log("✅ Connexion à la base de données réussie")
    } catch (dbError) {
      console.error("❌ Erreur de connexion à la base de données:", dbError)
      return res.status(500).json({
        message: "Erreur de connexion à la base de données",
        error: process.env.NODE_ENV === "development" ? dbError : "Erreur interne",
      })
    }

    // Vérifier si l'utilisateur existe déjà
    const existingCustomer = await prisma.customers.findUnique({
      where: { email },
    })

    if (existingCustomer) {
      console.log("❌ Client existe déjà:", email)
      return res.status(400).json({ message: "Un compte avec cet email existe déjà" })
    }

    console.log("✅ Email disponible, création du client...")

    // Hasher le mot de passe
    const hashedPassword = await hashPassword(password)

    // Créer le nouveau client
    const customer = await prisma.customers.create({
      data: {
        email,
        name: `${firstName} ${lastName}`,
        password: hashedPassword,
        phone: phone || null,
      },
    })

    console.log("✅ Client créé:", customer.id)

    // Créer la session
    session.customerId = customer.id
    session.email = customer.email
    session.name = customer.name
    session.role = "CUSTOMER"
    session.userType = "customer"
    session.isLoggedIn = true
    await session.save()

    console.log("✅ Session créée pour:", customer.email)

    res.status(201).json({
      message: "Compte créé avec succès",
      user: {
        id: customer.id,
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        type: "customer",
      },
    })
  } catch (error: any) {
    console.error("❌ Erreur lors de l'inscription:", error)

    if (error.name === "ZodError") {
      return res.status(400).json({
        message: "Données invalides",
        errors: error.errors,
        details: error.errors.map((e: any) => `${e.path.join(".")}: ${e.message}`),
      })
    }

    if (error.code === "P2002") {
      return res.status(400).json({ message: "Un compte avec cet email existe déjà" })
    }

    res.status(500).json({
      message: "Erreur interne du serveur",
      error: process.env.NODE_ENV === "development" ? error.message : "Erreur interne",
    })
  }
}
