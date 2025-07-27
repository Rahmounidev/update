import type { NextApiRequest, NextApiResponse } from "next"
import { getIronSession } from "iron-session"
import { prisma } from "@/lib/db"
import { loginSchema } from "@/lib/validations/auth"
import { sessionOptions, type SessionData } from "@/lib/session"
import { verifyPassword } from "@/lib/auth"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Méthode non autorisée" })
  }

  try {
    console.log("🔍 Tentative de connexion...")
    const session = await getIronSession<SessionData>(req, res, sessionOptions)

   
    const validatedData = loginSchema.parse(req.body)
    const { email, password } = validatedData

    console.log("📧 Email de connexion:", email)

  
    const customer = await prisma.customers.findUnique({
      where: { email },
    })

    if (customer && customer.password) {
      // Vérifier le mot de passe 
      const isValidPassword = await verifyPassword(password, customer.password)

      if (isValidPassword) {
     
        session.customerId = customer.id
        session.email = customer.email
        session.name = customer.name
        session.role = "CUSTOMER"
        session.userType = "customer"
        session.isLoggedIn = true
        await session.save()

        console.log("✅ Connexion client réussie:", customer.email)

        return res.status(200).json({
          message: "Connexion réussie",
          user: {
            id: customer.id,
            name: customer.name,
            email: customer.email,
            phone: customer.phone,
            type: "customer",
          },
        })
      }
    }

    
    const user = await prisma.users.findUnique({
      where: { email },
      include: {
        userRoles: {
          include: {
            role: true,
          },
        },
      },
    })

    if (user) {
      const isValidPassword = await verifyPassword(password, user.password)

      if (isValidPassword) {
        session.userId = user.id
        session.email = user.email
        session.name = user.name
        session.role = user.role
        session.userType = "user"
        session.isLoggedIn = true
        await session.save()

        console.log("✅ Connexion utilisateur réussie:", user.email)

        return res.status(200).json({
          message: "Connexion réussie",
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
            type: "user",
          },
        })
      }
    }

    console.log("❌ Identifiants invalides pour:", email)
    return res.status(401).json({ message: "Email ou mot de passe incorrect" })
  } catch (error: any) {
    console.error("❌ Erreur lors de la connexion:", error)

    if (error.name === "ZodError") {
      return res.status(400).json({
        message: "Données invalides",
        errors: error.errors,
      })
    }

    res.status(500).json({
      message: "Erreur interne du serveur",
      error: process.env.NODE_ENV === "development" ? error.message : "Erreur interne",
    })
  }
}
