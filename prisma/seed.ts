import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  console.log("🌱 Seeding database...")

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
  ])

  // Créer des restaurants
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
        cuisine: "Marocaine",
        role: "RESTAURANT",
        isActive: true,
        isOpen: true,
        hours: "Lun-Dim: 12h-23h",
        deliveryRadius: "10km",
        minimumOrder: 50.0,
        customMessage: "Bienvenue au Tajine Royal ! Découvrez nos spécialités marocaines.",
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
        cuisine: "Italienne",
        role: "RESTAURANT",
        isActive: true,
        isOpen: true,
        hours: "Lun-Dim: 18h-00h",
        deliveryRadius: "8km",
        minimumOrder: 40.0,
        customMessage: "Pizza Corner - Les meilleures pizzas de Rabat !",
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
        cuisine: "Japonaise",
        role: "RESTAURANT",
        isActive: true,
        isOpen: true,
        hours: "Mar-Dim: 19h-23h",
        deliveryRadius: "12km",
        minimumOrder: 80.0,
        customMessage: "Sushi Zen - L'art culinaire japonais à Marrakech",
      },
    }),
  ])

  // Créer les plats
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
    prisma.dishes.create({
      data: {
        name: "Pastilla au Poulet",
        description: "Feuilleté traditionnel au poulet, amandes et cannelle, saupoudré de sucre glace",
        price: 65.0,
        image: "/placeholder.svg?height=300&width=400",
        isAvailable: true,
        preparationTime: 30,
        ingredients: ["Pâte filo", "Poulet", "Amandes", "Cannelle", "Sucre glace"],
        calories: 450,
        isVegetarian: false,
        isVegan: false,
        isGlutenFree: false,
        categoryId: categories[0].id,
        userId: restaurants[0].id,
      },
    }),
    prisma.dishes.create({
      data: {
        name: "Thé à la Menthe",
        description: "Thé vert traditionnel marocain à la menthe fraîche",
        price: 15.0,
        image: "/placeholder.svg?height=300&width=400",
        isAvailable: true,
        preparationTime: 5,
        ingredients: ["Thé vert", "Menthe fraîche", "Sucre"],
        calories: 25,
        isVegetarian: true,
        isVegan: true,
        isGlutenFree: true,
        categoryId: categories[3].id,
        userId: restaurants[0].id,
      },
    }),
  ])

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
    prisma.customers.create({
      data: {
        email: "client2@example.com",
        name: "Fatima Alaoui",
        phone: "+212 6 55 66 77 88",
        address: "34 Avenue de la Liberté",
        city: "Rabat",
      },
    }),
    prisma.customers.create({
      data: {
        email: "client3@example.com",
        name: "Youssef Tazi",
        phone: "+212 6 99 88 77 66",
        address: "56 Boulevard Mohammed VI",
        city: "Marrakech",
      },
    }),
  ])

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
            {
              dishId: tajineRoyalDishes[3].id,
              quantity: 2,
              price: 15.0,
            },
          ],
        },
      },
    }),
  ])

  // Créer avis
  const reviews = await Promise.all([
    prisma.reviews.create({
      data: {
        customerId: customers[0].id,
        userId: restaurants[0].id,
        rating: 5,
        comment: "Excellent tajine ! Service rapide et plats délicieux. Je recommande vivement !",
      },
    }),
  ])

  console.log("✅ Database seeded successfully!")
  console.log(`📊 Created:`)
  console.log(`   - ${categories.length} categories`)
  console.log(`   - ${restaurants.length} restaurants`)
  console.log(`   - ${tajineRoyalDishes.length} dishes`)
  console.log(`   - ${customers.length} customers`)
  console.log(`   - ${orders.length} orders`)
  console.log(`   - ${reviews.length} reviews`)
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
