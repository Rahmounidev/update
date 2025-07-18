import bcrypt from "bcryptjs"
import { prisma } from "./db"

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

// Vérifier les permissions utilisateur
export async function checkUserPermissions(userId: string, resource: string, action: string): Promise<boolean> {
  try {
    const userWithRoles = await prisma.users.findUnique({
      where: { id: userId },
      include: {
        userRoles: {
          include: {
            role: true
          }
        }
      }
    })

    if (!userWithRoles) return false

    // Vérifier les permissions dans les rôles
    for (const userRole of userWithRoles.userRoles) {
      const permissions = userRole.role.permissions as any
      if (permissions && permissions[resource] && permissions[resource].includes(action)) {
        return true
      }
    }

    return false
  } catch (error) {
    console.error("Erreur lors de la vérification des permissions:", error)
    return false
  }
}

// Créer les rôles par défaut
export async function createDefaultRoles() {
  try {
    // Rôle Admin
    await prisma.roles.upsert({
      where: { name: "ADMIN" },
      update: {},
      create: {
        name: "ADMIN",
        description: "Administrateur système",
        permissions: {
          users: ["create", "read", "update", "delete"],
          orders: ["create", "read", "update", "delete"],
          dishes: ["create", "read", "update", "delete"],
          reviews: ["create", "read", "update", "delete"],
          promotions: ["create", "read", "update", "delete"]
        }
      }
    })

    // Rôle Restaurant
    await prisma.roles.upsert({
      where: { name: "RESTAURANT" },
      update: {},
      create: {
        name: "RESTAURANT",
        description: "Propriétaire de restaurant",
        permissions: {
          orders: ["read", "update"],
          dishes: ["create", "read", "update", "delete"],
          reviews: ["read", "update"],
          promotions: ["create", "read", "update", "delete"]
        }
      }
    })

    // Rôle Customer
    await prisma.roles.upsert({
      where: { name: "CUSTOMER" },
      update: {},
      create: {
        name: "CUSTOMER",
        description: "Client",
        permissions: {
          orders: ["create", "read"],
          reviews: ["create", "read", "update"]
        }
      }
    })

    console.log("✅ Rôles par défaut créés")
  } catch (error) {
    console.error("❌ Erreur lors de la création des rôles:", error)
  }
}
