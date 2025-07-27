import type { NextApiRequest, NextApiResponse } from "next"
import { getIronSession } from "iron-session"
import { prisma } from "@/lib/db"
import { sessionOptions, type SessionData } from "@/lib/session"
import { profileSchema } from "@/lib/validations/profile"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getIronSession<SessionData>(req, res, sessionOptions)

  if (!session.isLoggedIn || !session.customerId) {
    return res.status(401).json({ message: "Non authentifié" })
  }

  const customerId = session.customerId

  if (req.method === "GET") {
    try {
      const customer = await prisma.customers.findUnique({
        where: { id: customerId },
      })

      if (!customer) {
        return res.status(404).json({ message: "Profil non trouvé" })
      }

      return res.status(200).json({
        profile: {
          id: customer.id,
          name: customer.name,
          email: customer.email,
          phone: customer.phone,
          address: customer.address,
          city: customer.city,
          createdAt: customer.createdAt,
        },
      })
    } catch (error) {
      console.error("Erreur GET profil:", error)
      return res.status(500).json({ message: "Erreur lors de la récupération du profil" })
    }
  }

  if (req.method === "PATCH") {
    try {
      const parsed = profileSchema.safeParse(req.body)

      if (!parsed.success) {
        return res.status(400).json({
          message: "Données invalides",
          errors: parsed.error.flatten().fieldErrors,
        })
      }

      const updatedCustomer = await prisma.customers.update({
        where: { id: customerId },
        data: parsed.data,
      })

      if (parsed.data.name) {
        session.name = parsed.data.name
        await session.save()
      }

      return res.status(200).json({
        message: "Profil mis à jour avec succès",
        profile: {
          id: updatedCustomer.id,
          name: updatedCustomer.name,
          email: updatedCustomer.email,
          phone: updatedCustomer.phone,
          address: updatedCustomer.address,
          city: updatedCustomer.city,
        },
      })
    } catch (error) {
      console.error("Erreur PATCH profil:", error)
      return res.status(500).json({ message: "Erreur serveur lors de la mise à jour du profil" })
    }
  }

  return res.status(405).json({ message: "Méthode non autorisée" })
}
