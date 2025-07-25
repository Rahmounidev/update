"use client"

import { useState, useEffect } from "react"
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
  // States données API
  const [restaurant, setRestaurant] = useState<any>(null)
  const [reviews, setReviews] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // States menu / ajout panier
  const [cart, setCart] = useState<CartItem[]>([])
  const [selectedItem, setSelectedItem] = useState<any>(null)
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({})
  const [selectedExtras, setSelectedExtras] = useState<string[]>([])
  const [specialInstructions, setSpecialInstructions] = useState("")
  const [quantity, setQuantity] = useState(1)

  // States ajout avis
  const [newRating, setNewRating] = useState(0)
  const [newComment, setNewComment] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

   // Nouveau state pour la session utilisateur (optionnel, si tu veux mémoriser)
   const [sessionUser, setSessionUser] = useState<any>(null)

   // ** Ajout du useEffect pour vérifier la session **
   useEffect(() => {
     async function checkSession() {
       try {
         const res = await fetch("/api/session", { credentials: "include" })
         if (res.ok) {
           const data = await res.json()
           console.log("Session user:", data)
           setSessionUser(data) // stocker si besoin
         } else {
           console.log("Pas connecté")
           setSessionUser(null)
         }
       } catch (error) {
         console.error("Erreur check session:", error)
         setSessionUser(null)
       }
     }
     checkSession()
   }, [])
   
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        setError(null)

        // Récupérer infos restaurant + menu
        const resRestaurant = await fetch(`/api/restaurants/${params.id}`, { credentials: "include" })
        if (!resRestaurant.ok) throw new Error("Erreur chargement restaurant")
        const dataRestaurant = await resRestaurant.json()
        if (!dataRestaurant.restaurant) throw new Error("Restaurant non trouvé")

        // Récupérer avis paginés (page 1, 10)
        const resReviews = await fetch(`/api/reviews/restaurant/${params.id}?page=1&limit=10`, { credentials: "include" })
        if (!resReviews.ok) throw new Error("Erreur chargement avis")
        const dataReviews = await resReviews.json()

        setRestaurant(dataRestaurant.restaurant)
        setReviews(dataReviews.reviews)
      } catch (err: any) {
        setError(err.message || "Erreur inconnue")
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [params.id])

  // Fonction pour envoyer l'avis
  async function submitReview() {
    if (newRating < 1 || newRating > 5) {
      setSubmitError("Veuillez sélectionner une note entre 1 et 5.")
      return
    }
    if (newComment.trim() === "") {
      setSubmitError("Veuillez écrire un commentaire.")
      return
    }
    setSubmitting(true)
    setSubmitError(null)
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // Important pour envoyer cookie session
        body: JSON.stringify({
          rating: newRating,
          comment: newComment,
          userId: restaurant.id,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        setSubmitError(data.message || "Erreur lors de l'envoi de l'avis.")
        setSubmitting(false)
        return
      }
      const data = await res.json()

      // Ajoute l'avis créé dans la liste (en tête)
      setReviews((prev) => [data.review, ...prev])
      setNewRating(0)
      setNewComment("")
      alert("Merci pour votre avis !")
    } catch (error) {
      setSubmitError("Erreur réseau, veuillez réessayer.")
    }
    setSubmitting(false)
  }

  const openItemDialog = (item: any) => {
    setSelectedItem(item)
    setSelectedOptions({})
    setSelectedExtras([])
    setSpecialInstructions("")
    setQuantity(1)
  }

  const calculateItemPrice = () => {
    if (!selectedItem) return 0
    let price = selectedItem.price
    Object.values(selectedOptions).forEach((option: string) => {
      const match = option.match(/\+(\d+) DH/)
      if (match) {
        price += Number(match[1])
      }
    })
    selectedExtras.forEach((extraName) => {
      const extra = selectedItem.extras.find((e: any) => e.name === extraName)
      if (extra) price += extra.price
    })
    return price * quantity
  }

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
    setSelectedItem(null)
    setSelectedOptions({})
    setSelectedExtras([])
    setSpecialInstructions("")
    setQuantity(1)
  }

  const getTotalCartPrice = () => cart.reduce((total, item) => total + item.price, 0)

  const setSearchQuery = (query: string) => {
    console.log("Search:", query)
  }

  if (loading) return <p className="p-4">Chargement...</p>
  if (error) return <p className="p-4 text-red-600">Erreur : {error}</p>
  if (!restaurant) return <p className="p-4">Restaurant non trouvé.</p>

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <ModernHeader cartItemsCount={cart.length} userLocation="Casablanca, Maroc" onSearch={setSearchQuery} />

      <WhatsAppNotification
        orderId="ORD-2024-001"
        status="in_progress"
        restaurantName={restaurant.restaurantName || restaurant.name}
        estimatedTime={restaurant.deliveryTime || "30-40 min"}
      />

      {/* Restaurant Info */}
      <section className="relative">
        <Image
          src={restaurant.logo || "/placeholder.svg"}
          alt={restaurant.restaurantName || restaurant.name}
          width={600}
          height={300}
          className="w-full h-64 object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40" />
        <div className="absolute bottom-0 left-0 right-0 text-white p-6">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-4xl font-bold mb-2">{restaurant.restaurantName || restaurant.name}</h1>
            <p className="text-lg mb-4">{restaurant.description}</p>
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center space-x-1">
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">{restaurant.averageRating ?? restaurant.rating}</span>
                <span className="text-gray-300">({restaurant.reviewCount ?? 0} avis)</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="h-5 w-5" />
                <span>{restaurant.deliveryTime || "30-40 min"}</span>
              </div>
              <div className="flex items-center space-x-1">
                <MapPin className="h-5 w-5" />
                <span>{restaurant.address || restaurant.location}</span>
              </div>
              <Badge variant={restaurant.isOpen ? "default" : "secondary"}>
                {restaurant.isOpen ? `Ouvert - ${restaurant.hours || restaurant.openingHours}` : "Fermé"}
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
              <div className="lg:col-span-1">
                <div className="sticky top-4">
                  <h3 className="font-semibold text-lg mb-4">Catégories</h3>
                  <nav className="space-y-2">
                    {restaurant.menu?.map((category: any) => (
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

              <div className="lg:col-span-3">
                {restaurant.menu?.map((category: any) => (
                  <div key={category.id} id={`category-${category.id}`} className="mb-8">
                    <h2 className="text-2xl font-bold mb-4">{category.name}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {category.dishes.map((item: any) => (
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
                                          {(selectedItem.options ?? []).map((option: any, index: number) => (
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

                                          {(selectedItem.extras ?? []).length > 0 && (
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
                                                          setSelectedExtras(selectedExtras.filter((e) => e !== extra.name))
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

                                          <div className="space-y-2">
                                            <Label className="text-sm font-medium">Instructions spéciales</Label>
                                            <Textarea
                                              placeholder="Allergies, préférences de cuisson..."
                                              value={specialInstructions}
                                              onChange={(e) => setSpecialInstructions(e.target.value)}
                                            />
                                          </div>

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
                                              <Button variant="outline" size="sm" onClick={() => setQuantity(quantity + 1)}>
                                                <Plus className="h-4 w-4" />
                                              </Button>
                                            </div>
                                          </div>
                                        </div>
                                      )}

                                      <DialogFooter>
                                        <div className="flex justify-between items-center w-full">
                                          <span className="font-bold text-lg">{calculateItemPrice().toFixed(2)} DH</span>
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
                  <p className="text-gray-600">{restaurant.address || restaurant.location}</p>
                </div>
                <div>
                  <h4 className="font-medium">Téléphone</h4>
                  <p className="text-gray-600">{restaurant.phone}</p>
                </div>
                <div>
                  <h4 className="font-medium">Horaires d'ouverture</h4>
                  <p className="text-gray-600">{restaurant.hours || restaurant.openingHours}</p>
                </div>
                <div>
                  <h4 className="font-medium">Type de cuisine</h4>
                  <p className="text-gray-600">{restaurant.cuisines?.join(", ") || restaurant.cuisine}</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews" className="mt-6">
            

            {/* Liste des avis */}
            <ReviewSystem
              restaurantId={restaurant.id.toString()}
              reviews={reviews}
              averageRating={restaurant.averageRating ?? restaurant.rating}
              totalReviews={restaurant.reviewCount ?? 0}
            />
          </TabsContent>
        </Tabs>
      </section>

      <Footer />
    </div>
  )
}
