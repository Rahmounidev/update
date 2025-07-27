import { PrismaClient } from "@prisma/client";
const globalForPrisma = globalThis;
export const prisma = globalForPrisma.prisma ?? new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
});
if (process.env.NODE_ENV !== "production")
    globalForPrisma.prisma = prisma;
export async function testConnection() {
    try {
        await prisma.$connect();
        console.log("✅ Connexion à la base de données réussie");
        return true;
    }
    catch (error) {
        console.error("❌ Erreur de connexion à la base de données:", error);
        return false;
    }
}
export async function disconnectDB() {
    await prisma.$disconnect();
}
