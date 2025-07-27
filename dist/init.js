"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = handler;
const db_1 = require("@/lib/db");
const auth_1 = require("@/lib/auth");
async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Méthode non autorisée" });
    }
    try {
        console.log("🚀 Initialisation de l'application...");
        await (0, auth_1.createDefaultRoles)();
        const adminEmail = "admin@droovo.com";
        const adminPassword = "admin123";
        const existingAdmin = await db_1.prisma.users.findUnique({
            where: { email: adminEmail },
        });
        if (!existingAdmin) {
            const hashedPassword = await (0, auth_1.hashPassword)(adminPassword);
            const admin = await db_1.prisma.users.create({
                data: {
                    email: adminEmail,
                    password: hashedPassword,
                    name: "Administrateur",
                    role: "ADMIN",
                    restaurantName: "Droovo Admin",
                },
            });
            const adminRole = await db_1.prisma.roles.findUnique({
                where: { name: "ADMIN" },
            });
            if (adminRole) {
                await db_1.prisma.user_roles.create({
                    data: {
                        userId: admin.id,
                        roleId: adminRole.id,
                    },
                });
            }
            console.log("✅ Administrateur créé:", adminEmail);
        }
        const defaultCategories = [
            { name: "Entrées", description: "Plats d'entrée" },
            { name: "Plats principaux", description: "Plats de résistance" },
            { name: "Desserts", description: "Desserts et sucreries" },
            { name: "Boissons", description: "Boissons chaudes et froides" },
        ];
        for (const category of defaultCategories) {
            await db_1.prisma.categories.upsert({
                where: { name: category.name },
                update: {},
                create: category,
            });
        }
        console.log("✅ Catégories par défaut créées");
        res.status(200).json({
            success: true,
            message: "Initialisation terminée avec succès",
            data: {
                adminEmail,
                adminPassword,
                categoriesCreated: defaultCategories.length,
            },
        });
    }
    catch (error) {
        console.error("❌ Erreur lors de l'initialisation:", error);
        res.status(500).json({
            success: false,
            message: "Erreur lors de l'initialisation",
            error: process.env.NODE_ENV === "development" ? error.message : "Erreur interne",
        });
    }
}
