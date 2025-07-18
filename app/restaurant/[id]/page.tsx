"use client"

import { useState } from "react"
import { Star, Clock, MapPin, Plus, Minus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import Image from "next/image"
import Footer from "@/components/footer"
import ReviewSystem from "@/components/reviews/review-system"
import WhatsAppNotification from "@/components/notifications/whatsapp-notification"
import ModernHeader from "@/components/header/modern-header"

// Mock data pour le restaurant
const restaurant = {
  id: 1,
  name: "Pizza Palace",
  cuisine: "Italien",
  rating: 4.5,
  reviewCount: 234,
  deliveryTime: "25-35 min",
  image: "/placeholder.svg?height=300&width=600",
  description: "Pizzas authentiques et pâtes fraîches préparées avec des ingrédients de qualité",
  location: "123 Avenue Hassan II, Centre-ville, Casablanca",
  phone: "+212 5 22 98 76 54",
  isOpen: true,
  openingHours: "11h00 - 23h00",
}

const menuCategories = [
  {
    id: 1,
    name: "Pizzas",
    items: [
      {
        id: 1,
        name: "Pizza Margherita",
        description: "Sauce tomate, mozzarella, basilic frais",
        price: 129,
        image: "/placeholder.svg?height=150&width=200",
        options: [
          { name: "Taille", choices: ["Petite (+0 DH)", "Moyenne (+30 DH)", "Grande (+60 DH)"], required: true },
          { name: "Pâte", choices: ["Fine", "Épaisse", "Sans gluten (+20 DH)"], required: true },
        ],
        extras: [
          { name: "Olives", price: 15 },
          { name: "Champignons", price: 20 },
          { name: "Jambon", price: 25 },
        ],
      },
      {
        id: 2,
        name: "Pizza 4 Fromages",
        description: "Mozzarella, gorgonzola, parmesan, chèvre",
        price: 159,
        image: "/placeholder.svg?height=150&width=200",
        options: [
          { name: "Taille", choices: ["Petite (+0 DH)", "Moyenne (+30 DH)", "Grande (+60 DH)"], required: true },
          { name: "Pâte", choices: ["Fine", "Épaisse", "Sans gluten (+20 DH)"], required: true },
        ],
        extras: [
          { name: "Noix", price: 20 },
          { name: "Miel", price: 10 },
        ],
      },
    ],
  },
  {
    id: 2,
    name: "Pâtes",
    items: [
      {
        id: 3,
        name: "Spaghetti Carbonara",
        description: "Spaghetti, lardons, œuf, parmesan, crème fraîche",
        price: 135,
        image: "/placeholder.svg?height=150&width=200",
        options: [{ name: "Portion", choices: ["Normale", "Grande (+30 DH)"], required: true }],
        extras: [
          { name: "Parmesan supplémentaire", price: 20 },
          { name: "Lardons supplémentaires", price: 25 },
        ],
      },
    ],
  },
  {
    id: 3,
    name: "Desserts",
    items: [
      {
        id: 4,
        name: "Tiramisu",
        description: "Mascarpone, café, cacao, biscuits à la cuillère",
        price: 65,
        image: "/placeholder.svg?height=150&width=200",
        options: [],
        extras: [],
      },
    ],
  },
]

interface CartItem {
  id: number
  name: string
  price: number
  quantity: number
  selectedOptions: Record<string, string>
  selectedExtras: string[]
  specialInstructions: string
}

export default function RestaurantPage({ params }: { params: { id: string } }) {
  const [cart, setCart] = useState<CartItem[]>([])
  const [selectedItem, setSelectedItem] = useState<any>(null)
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({})
  const [selectedExtras, setSelectedExtras] = useState<string[]>([])
  const [specialInstructions, setSpecialInstructions] = useState("")
  const [quantity, setQuantity] = useState(1)

  const addToCart = () => {
    if (!selectedItem) return

    const cartItem: CartItem = {
      id: Date.now(),
      name: selectedItem.name,
      price: calculateItemPrice(),
      quantity,
      selectedOptions,
      selectedExtras,
      specialInstructions,
    }

    setCart([...cart, cartItem])

    // Reset form
    setSelectedItem(null)
    setSelectedOptions({})
    setSelectedExtras([])
    setSpecialInstructions("")
    setQuantity(1)
  }

  const calculateItemPrice = () => {
    if (!selectedItem) return 0

    let price = selectedItem.price

    // Add option prices
    Object.values(selectedOptions).forEach((option: string) => {
      const match = option.match(/\+(\d+) DH/)
      if (match) {
        price += Number.parseFloat(match[1])
      }
    })

    // Add extra prices
    selectedExtras.forEach((extraName) => {
      const extra = selectedItem.extras.find((e: any) => e.name === extraName)
      if (extra) {
        price += extra.price
      }
    })

    return price * quantity
  }

  const getTotalCartPrice = () => {
    return cart.reduce((total, item) => total + item.price, 0)
  }

  const openItemDialog = (item: any) => {
    setSelectedItem(item)
    setSelectedOptions({})
    setSelectedExtras([])
    setSpecialInstructions("")
    setQuantity(1)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <ModernHeader cartItemsCount={cart.length} userLocation="Paris, France" />

      <WhatsAppNotification
        orderId="ORD-2024-001"
        status="in_progress"
        restaurantName={restaurant.name}
        estimatedTime={restaurant.deliveryTime}
      />

      {/* Restaurant Info */}
      <section className="relative">
        <Image
          src={restaurant.image || "/placeholder.svg"}
          alt={restaurant.name}
          width={600}
          height={300}
          className="w-full h-64 object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40" />
        <div className="absolute bottom-0 left-0 right-0 text-white p-6">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-4xl font-bold mb-2">{restaurant.name}</h1>
            <p className="text-lg mb-4">{restaurant.description}</p>
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center space-x-1">
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">{restaurant.rating}</span>
                <span className="text-gray-300">({restaurant.reviewCount} avis)</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="h-5 w-5" />
                <span>{restaurant.deliveryTime}</span>
              </div>
              <div className="flex items-center space-x-1">
                <MapPin className="h-5 w-5" />
                <span>{restaurant.location}</span>
              </div>
              <Badge variant={restaurant.isOpen ? "default" : "secondary"}>
                {restaurant.isOpen ? `Ouvert - ${restaurant.openingHours}` : "Fermé"}
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Menu */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="menu" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="menu">Menu</TabsTrigger>
            <TabsTrigger value="info">Informations</TabsTrigger>
            <TabsTrigger value="reviews">Avis</TabsTrigger>
          </TabsList>

          <TabsContent value="menu" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Categories Navigation */}
              <div className="lg:col-span-1">
                <div className="sticky top-4">
                  <h3 className="font-semibold text-lg mb-4">Catégories</h3>
                  <nav className="space-y-2">
                    {menuCategories.map((category) => (
                      <a
                        key={category.id}
                        href={`#category-${category.id}`}
                        className="block px-3 py-2 rounded-md text-sm hover:bg-gray-100"
                      >
                        {category.name}
                      </a>
                    ))}
                  </nav>
                </div>
              </div>

              {/* Menu Items */}
              <div className="lg:col-span-3">
                {menuCategories.map((category) => (
                  <div key={category.id} id={`category-${category.id}`} className="mb-8">
                    <h2 className="text-2xl font-bold mb-4">{category.name}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {category.items.map((item) => (
                        <Card key={item.id} className="cursor-pointer hover:shadow-md transition-shadow">
                          <div className="flex">
                            <div className="flex-1 p-4">
                              <CardHeader className="p-0 mb-2">
                                <CardTitle className="text-lg">{item.name}</CardTitle>
                                <CardDescription className="text-sm">{item.description}</CardDescription>
                              </CardHeader>
                              <CardContent className="p-0">
                                <div className="flex justify-between items-center">
                                  <span className="text-lg font-bold text-orange-600">{item.price.toFixed(2)} DH</span>
                                  <Dialog>
                                    <DialogTrigger asChild>
                                      <Button size="sm" onClick={() => openItemDialog(item)}>
                                        <Plus className="h-4 w-4 mr-1" />
                                        Ajouter
                                      </Button>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-md">
                                      <DialogHeader>
                                        <DialogTitle>{selectedItem?.name}</DialogTitle>
                                        <DialogDescription>{selectedItem?.description}</DialogDescription>
                                      </DialogHeader>

                                      {selectedItem && (
                                        <div className="space-y-4">
                                          {/* Options */}
                                          {selectedItem.options.map((option: any, index: number) => (
                                            <div key={index} className="space-y-2">
                                              <Label className="text-sm font-medium">
                                                {option.name} {option.required && "*"}
                                              </Label>
                                              <div className="space-y-2">
                                                {option.choices.map((choice: string) => (
                                                  <div key={choice} className="flex items-center space-x-2">
                                                    <input
                                                      type="radio"
                                                      name={option.name}
                                                      value={choice}
                                                      onChange={(e) =>
                                                        setSelectedOptions({
                                                          ...selectedOptions,
                                                          [option.name]: e.target.value,
                                                        })
                                                      }
                                                      className="text-orange-600"
                                                    />
                                                    <Label className="text-sm">{choice}</Label>
                                                  </div>
                                                ))}
                                              </div>
                                            </div>
                                          ))}

                                          {/* Extras */}
                                          {selectedItem.extras.length > 0 && (
                                            <div className="space-y-2">
                                              <Label className="text-sm font-medium">Suppléments</Label>
                                              <div className="space-y-2">
                                                {selectedItem.extras.map((extra: any) => (
                                                  <div key={extra.name} className="flex items-center space-x-2">
                                                    <Checkbox
                                                      checked={selectedExtras.includes(extra.name)}
                                                      onCheckedChange={(checked) => {
                                                        if (checked) {
                                                          setSelectedExtras([...selectedExtras, extra.name])
                                                        } else {
                                                          setSelectedExtras(
                                                            selectedExtras.filter((e) => e !== extra.name),
                                                          )
                                                        }
                                                      }}
                                                    />
                                                    <Label className="text-sm">
                                                      {extra.name} (+{extra.price.toFixed(2)} DH)
                                                    </Label>
                                                  </div>
                                                ))}
                                              </div>
                                            </div>
                                          )}

                                          {/* Special Instructions */}
                                          <div className="space-y-2">
                                            <Label className="text-sm font-medium">Instructions spéciales</Label>
                                            <Textarea
                                              placeholder="Allergies, préférences de cuisson..."
                                              value={specialInstructions}
                                              onChange={(e) => setSpecialInstructions(e.target.value)}
                                            />
                                          </div>

                                          {/* Quantity */}
                                          <div className="flex items-center justify-between">
                                            <Label className="text-sm font-medium">Quantité</Label>
                                            <div className="flex items-center space-x-2">
                                              <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                              >
                                                <Minus className="h-4 w-4" />
                                              </Button>
                                              <span className="w-8 text-center">{quantity}</span>
                                              <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setQuantity(quantity + 1)}
                                              >
                                                <Plus className="h-4 w-4" />
                                              </Button>
                                            </div>
                                          </div>
                                        </div>
                                      )}

                                      <DialogFooter>
                                        <div className="flex justify-between items-center w-full">
                                          <span className="font-bold text-lg">
                                            {calculateItemPrice().toFixed(2)} DH
                                          </span>
                                          <Button onClick={addToCart}>Ajouter au panier</Button>
                                        </div>
                                      </DialogFooter>
                                    </DialogContent>
                                  </Dialog>
                                </div>
                              </CardContent>
                            </div>
                            <div className="w-24 h-24 m-4">
                              <Image
                                src={item.image || "/placeholder.svg"}
                                alt={item.name}
                                width={96}
                                height={96}
                                className="w-full h-full object-cover rounded-md"
                              />
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="info" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Informations du restaurant</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium">Adresse</h4>
                  <p className="text-gray-600">{restaurant.location}</p>
                </div>
                <div>
                  <h4 className="font-medium">Téléphone</h4>
                  <p className="text-gray-600">{restaurant.phone}</p>
                </div>
                <div>
                  <h4 className="font-medium">Horaires d'ouverture</h4>
                  <p className="text-gray-600">{restaurant.openingHours}</p>
                </div>
                <div>
                  <h4 className="font-medium">Type de cuisine</h4>
                  <p className="text-gray-600">{restaurant.cuisine}</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews" className="mt-6">
            <ReviewSystem
              restaurantId={restaurant.id.toString()}
              reviews={[
                {
                  id: "1",
                  userName: "Marie L.",
                  rating: 5,
                  comment: "Excellente pizza, livraison rapide et service impeccable !",
                  date: "Il y a 2 jours",
                  helpful: 12,
                  orderId: "ORD-2024-001",
                },
                {
                  id: "2",
                  userName: "Thomas D.",
                  rating: 4,
                  comment: "Très bon restaurant, je recommande les pâtes carbonara.",
                  date: "Il y a 1 semaine",
                  helpful: 8,
                  response: "Merci Thomas ! Nous sommes ravis que nos pâtes vous aient plu.",
                },
              ]}
              averageRating={restaurant.rating}
              totalReviews={restaurant.reviewCount}
            />
          </TabsContent>
        </Tabs>
      </section>
      <Footer />
    </div>
  )
}
