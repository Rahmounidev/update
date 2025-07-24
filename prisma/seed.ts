import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Créer des cuisines
  const cuisines = await Promise.all([
    prisma.cuisine.create({
      data: {
        name: "Marocaine",
      },
    }),
    prisma.cuisine.create({
      data: {
        name: "Italienne",
      },
    }),
    prisma.cuisine.create({
      data: {
        name: "Japonaise",
      },
    }),
    prisma.cuisine.create({
      data: {
        name: "Française",
      },
    }),
    prisma.cuisine.create({
      data: {
        name: "Libanaise",
      },
    }),
  ]);

  // Créer des catégories
  const categories = await Promise.all([
    prisma.categories.create({
      data: {
        name: "Entrées",
        description: "Délicieuses entrées pour commencer votre repas",
        image: "/placeholder.svg?height=200&width=300",
      },
    }),
    prisma.categories.create({
      data: {
        name: "Plats principaux",
        description: "Nos spécialités principales",
        image: "/placeholder.svg?height=200&width=300",
      },
    }),
    prisma.categories.create({
      data: {
        name: "Desserts",
        description: "Desserts maison pour finir en beauté",
        image: "/placeholder.svg?height=200&width=300",
      },
    }),
    prisma.categories.create({
      data: {
        name: "Boissons",
        description: "Boissons fraîches et chaudes",
        image: "/placeholder.svg?height=200&width=300",
      },
    }),
  ]);

  // Créer des restaurants et les associer aux cuisines
  const restaurants = await Promise.all([
    prisma.users.create({
      data: {
        email: "restaurant1@droovo.ma",
        password: "password123",
        name: "Restaurant Manager 1",
        phone: "+212 6 12 34 56 78",
        address: "123 Rue Mohammed V",
        city: "Casablanca",
        restaurantName: "Le Tajine Royal",
        description:
          "Restaurant traditionnel marocain proposant des tajines authentiques et des couscous savoureux dans une ambiance chaleureuse.",
        logo: "/placeholder.svg?height=100&width=100",
        role: "RESTAURANT",
        isActive: true,
        isOpen: true,
        hours: "Lun-Dim: 12h-23h",
        deliveryRadius: "10km",
        minimumOrder: 50.0,
        customMessage: "Bienvenue au Tajine Royal ! Découvrez nos spécialités marocaines.",
        cuisines: {
          connect: { id: cuisines[0].id }, // Associer avec "Marocaine"
        },
      },
    }),
    prisma.users.create({
      data: {
        email: "restaurant2@droovo.ma",
        password: "password123",
        name: "Restaurant Manager 2",
        phone: "+212 6 23 45 67 89",
        address: "456 Avenue Hassan II",
        city: "Rabat",
        restaurantName: "Pizza Corner",
        description: "Pizzeria moderne proposant des pizzas artisanales avec des ingrédients frais et de qualité.",
        logo: "/placeholder.svg?height=100&width=100",
        role: "RESTAURANT",
        isActive: true,
        isOpen: true,
        hours: "Lun-Dim: 18h-00h",
        deliveryRadius: "8km",
        minimumOrder: 40.0,
        customMessage: "Pizza Corner - Les meilleures pizzas de Rabat !",
        cuisines: {
          connect: { id: cuisines[1].id }, // Associer avec "Italienne"
        },
      },
    }),
    prisma.users.create({
      data: {
        email: "restaurant3@droovo.ma",
        password: "password123",
        name: "Restaurant Manager 3",
        phone: "+212 6 34 56 78 90",
        address: "789 Boulevard Zerktouni",
        city: "Marrakech",
        restaurantName: "Sushi Zen",
        description: "Restaurant japonais authentique proposant sushis, sashimis et plats traditionnels japonais.",
        logo: "/placeholder.svg?height=100&width=100",
        role: "RESTAURANT",
        isActive: true,
        isOpen: true,
        hours: "Mar-Dim: 19h-23h",
        deliveryRadius: "12km",
        minimumOrder: 80.0,
        customMessage: "Sushi Zen - L'art culinaire japonais à Marrakech",
        cuisines: {
          connect: { id: cuisines[2].id }, // Associer avec "Japonaise"
        },
      },
    }),
    prisma.users.create({
      data: {
        email: "restaurant4@droovo.ma",
        password: "password123",
        name: "Restaurant Manager 4",
        phone: "+212 6 45 67 89 01",
        address: "321 Rue de la République",
        city: "Fès",
        restaurantName: "Le Gourmet Libanais",
        description: "Spécialités libanaises authentiques dans une ambiance conviviale.",
        logo: "/placeholder.svg?height=100&width=100",
        role: "RESTAURANT",
        isActive: true,
        isOpen: true,
        hours: "Lun-Dim: 11h-22h",
        deliveryRadius: "10km",
        minimumOrder: 60.0,
        customMessage: "Découvrez nos saveurs libanaises au Gourmet Libanais",
        cuisines: {
          connect: { id: cuisines[4].id }, // Associer avec "Libanaise"
        },
      },
    }),
  ]);

  // Créer des plats pour "Le Tajine Royal"
  const tajineRoyalDishes = await Promise.all([
    prisma.dishes.create({
      data: {
        name: "Tajine Agneau aux Pruneaux",
        description: "Tajine traditionnel d'agneau mijoté avec des pruneaux, amandes et épices marocaines",
        price: 85.0,
        image: "/placeholder.svg?height=300&width=400",
        isAvailable: true,
        preparationTime: 45,
        ingredients: ["Agneau", "Pruneaux", "Amandes", "Oignons", "Épices marocaines"],
        calories: 650,
        isVegetarian: false,
        isVegan: false,
        isGlutenFree: true,
        categoryId: categories[1].id,
        userId: restaurants[0].id,
      },
    }),
    prisma.dishes.create({
      data: {
        name: "Couscous Royal",
        description: "Couscous traditionnel avec agneau, poulet, merguez et légumes de saison",
        price: 95.0,
        image: "/placeholder.svg?height=300&width=400",
        isAvailable: true,
        preparationTime: 60,
        ingredients: ["Semoule", "Agneau", "Poulet", "Merguez", "Légumes", "Bouillon"],
        calories: 750,
        isVegetarian: false,
        isVegan: false,
        isGlutenFree: false,
        categoryId: categories[1].id,
        userId: restaurants[0].id,
      },
    }),
  ]);

  // Créer des clients
  const customers = await Promise.all([
    prisma.customers.create({
      data: {
        email: "client1@example.com",
        name: "Ahmed Benali",
        phone: "+212 6 11 22 33 44",
        address: "12 Rue des Fleurs",
        city: "Casablanca",
      },
    }),
  ]);

  // Créer commandes
  const orders = await Promise.all([
    prisma.orders.create({
      data: {
        orderNumber: "CMD-1704067200-abc123",
        customerId: customers[0].id,
        userId: restaurants[0].id,
        status: "DELIVERED",
        totalAmount: 150.0,
        deliveryAddress: "12 Rue des Fleurs, Casablanca",
        paymentMethod: "CASH",
        paymentStatus: "COMPLETED",
        order_items: {
          create: [
            {
              dishId: tajineRoyalDishes[0].id,
              quantity: 1,
              price: 85.0,
            },
          ],
        },
      },
    }),
  ]);

  console.log("✅ Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
