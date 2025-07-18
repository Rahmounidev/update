"use client"

import { useState } from "react"
import { Clock, MapPin, Phone, Star, MessageCircle } from "lucide-react"
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
import Link from "next/link"
import Footer from "@/components/footer"
import ModernHeader from "@/components/header/modern-header"
import WhatsAppNotification from "@/components/notifications/whatsapp-notification"

// Mock data pour les commandes
const orders = [
  {
    id: "ORD-2024-001",
    restaurant: "Pizza Palace",
    date: "2024-01-15",
    time: "19:30",
    status: "delivered",
    total: 47.8,
    items: [
      { name: "Pizza Margherita", quantity: 2, price: 31.8 },
      { name: "Spaghetti Carbonara", quantity: 1, price: 13.5 },
    ],
    deliveryAddress: "123 Rue Abderrahman El Ghafiki, 20100 Casablanca",
    estimatedTime: "25-35 min",
    rating: null,
  },
  {
    id: "ORD-2024-002",
    restaurant: "Sushi Zen",
    date: "2024-01-14",
    time: "20:15",
    status: "in_progress",
    total: 32.5,
    items: [
      { name: "Sushi Mix", quantity: 1, price: 28.0 },
      { name: "Miso Soup", quantity: 1, price: 4.5 },
    ],
    deliveryAddress: "123 Rue Abderrahman El Ghafiki, 20100 Casablanca",
    estimatedTime: "30-40 min",
    rating: null,
  },
  {
    id: "ORD-2024-003",
    restaurant: "Burger House",
    date: "2024-01-12",
    time: "18:45",
    status: "delivered",
    total: 24.9,
    items: [
      { name: "Classic Burger", quantity: 1, price: 12.9 },
      { name: "Frites", quantity: 1, price: 4.5 },
      { name: "Coca-Cola", quantity: 1, price: 2.5 },
    ],
    deliveryAddress: "123 Rue Abderrahman El Ghafiki, 20100 Casablanca",
    estimatedTime: "20-30 min",
    rating: 4,
  },
]

const getStatusBadge = (status: string) => {
  switch (status) {
    case "pending":
      return <Badge variant="secondary">En attente</Badge>
    case "confirmed":
      return <Badge variant="default">Confirmée</Badge>
    case "in_progress":
      return (
        <Badge variant="default" className="bg-orange-500">
          En préparation
        </Badge>
      )
    case "ready":
      return (
        <Badge variant="default" className="bg-blue-500">
          Prête
        </Badge>
      )
    case "delivered":
      return (
        <Badge variant="default" className="bg-green-500">
          Livrée
        </Badge>
      )
    case "cancelled":
      return <Badge variant="destructive">Annulée</Badge>
    default:
      return <Badge variant="secondary">{status}</Badge>
  }
}

const getStatusMessage = (status: string) => {
  switch (status) {
    case "pending":
      return "Votre commande est en attente de confirmation"
    case "confirmed":
      return "Votre commande a été confirmée par le restaurant"
    case "in_progress":
      return "Votre commande est en cours de préparation"
    case "ready":
      return "Votre commande est prête pour la livraison/le retrait"
    case "delivered":
      return "Votre commande a été livrée avec succès"
    case "cancelled":
      return "Votre commande a été annulée"
    default:
      return "Statut inconnu"
  }
}

export default function OrdersPage() {
  const [selectedOrder, setSelectedOrder] = useState<any>(null)
  const [rating, setRating] = useState(0)
  const [review, setReview] = useState("")

  const activeOrders = orders.filter((order) => order.status !== "delivered" && order.status !== "cancelled")
  const pastOrders = orders.filter((order) => order.status === "delivered" || order.status === "cancelled")

  const submitReview = () => {
    // Logique pour soumettre l'avis
    console.log("Review submitted:", { orderId: selectedOrder.id, rating, review })
    setSelectedOrder(null)
    setRating(0)
    setReview("")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <ModernHeader cartItemsCount={0} userLocation="Casablanca, Maroc" />
      <WhatsAppNotification orderId="ORD-2024-002" status="ready" restaurantName="Sushi Zen" estimatedTime="5 min" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Mes commandes</h2>

        <Tabs defaultValue="active" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="active">Commandes en cours ({activeOrders.length})</TabsTrigger>
            <TabsTrigger value="past">Historique ({pastOrders.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="mt-6">
            {activeOrders.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <Clock className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune commande en cours</h3>
                  <p className="text-gray-600 mb-6">Vous n'avez pas de commande en cours actuellement</p>
                  <Link href="/">
                    <Button>Commander maintenant</Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {activeOrders.map((order) => (
                  <Card key={order.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="flex items-center space-x-2">
                            <span>{order.restaurant}</span>
                            {getStatusBadge(order.status)}
                          </CardTitle>
                          <CardDescription>
                            Commande #{order.id} • {order.date} à {order.time}
                          </CardDescription>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold">{order.total.toFixed(2)} DH</p>
                          <div className="text-sm text-green-600 mt-1">
                            +{Math.floor(order.total / 10)} points de fidélité gagnés
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <p className="text-blue-800 font-medium">{getStatusMessage(order.status)}</p>
                          {order.status === "in_progress" && (
                            <p className="text-blue-600 text-sm mt-1">Temps estimé: {order.estimatedTime}</p>
                          )}
                        </div>

                        <div>
                          <h4 className="font-medium mb-2">Articles commandés:</h4>
                          <div className="space-y-1">
                            {order.items.map((item, index) => (
                              <div key={index} className="flex justify-between text-sm">
                                <span>
                                  {item.quantity}x {item.name}
                                </span>
                                <span>{item.price.toFixed(2)} DH</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="flex items-center text-sm text-gray-600">
                          <MapPin className="h-4 w-4 mr-1" />
                          <span>{order.deliveryAddress}</span>
                        </div>

                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <Phone className="h-4 w-4 mr-1" />
                            Contacter le restaurant
                          </Button>
                          <Button variant="outline" size="sm">
                            <MessageCircle className="h-4 w-4 mr-1" />
                            Support
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="past" className="mt-6">
            {pastOrders.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <Clock className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune commande passée</h3>
                  <p className="text-gray-600 mb-6">Vous n'avez pas encore passé de commande</p>
                  <Link href="/">
                    <Button>Découvrir les restaurants</Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {pastOrders.map((order) => (
                  <Card key={order.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="flex items-center space-x-2">
                            <span>{order.restaurant}</span>
                            {getStatusBadge(order.status)}
                          </CardTitle>
                          <CardDescription>
                            Commande #{order.id} • {order.date} à {order.time}
                          </CardDescription>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold">{order.total.toFixed(2)} DH</p>
                          <div className="text-sm text-green-600 mt-1">
                            +{Math.floor(order.total / 10)} points de fidélité gagnés
                          </div>
                          {order.rating && (
                            <div className="flex items-center mt-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < order.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium mb-2">Articles commandés:</h4>
                          <div className="space-y-1">
                            {order.items.map((item, index) => (
                              <div key={index} className="flex justify-between text-sm">
                                <span>
                                  {item.quantity}x {item.name}
                                </span>
                                <span>{item.price.toFixed(2)} DH</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="flex items-center text-sm text-gray-600">
                          <MapPin className="h-4 w-4 mr-1" />
                          <span>{order.deliveryAddress}</span>
                        </div>

                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            Recommander
                          </Button>
                          {order.status === "delivered" && !order.rating && (
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm" onClick={() => setSelectedOrder(order)}>
                                  <Star className="h-4 w-4 mr-1" />
                                  Évaluer
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Évaluer votre commande</DialogTitle>
                                  <DialogDescription>
                                    Comment s'est passée votre commande chez {selectedOrder?.restaurant} ?
                                  </DialogDescription>
                                </DialogHeader>

                                <div className="space-y-4">
                                  <div className="space-y-2">
                                    <Label>Note (sur 5 étoiles)</Label>
                                    <div className="flex space-x-1">
                                      {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                          key={star}
                                          type="button"
                                          onClick={() => setRating(star)}
                                          className="focus:outline-none"
                                        >
                                          <Star
                                            className={`h-8 w-8 ${
                                              star <= rating
                                                ? "fill-yellow-400 text-yellow-400"
                                                : "text-gray-300 hover:text-yellow-400"
                                            }`}
                                          />
                                        </button>
                                      ))}
                                    </div>
                                  </div>

                                  <div className="space-y-2">
                                    <Label htmlFor="review">Commentaire (optionnel)</Label>
                                    <Textarea
                                      id="review"
                                      placeholder="Partagez votre expérience..."
                                      value={review}
                                      onChange={(e) => setReview(e.target.value)}
                                    />
                                  </div>
                                </div>

                                <DialogFooter>
                                  <Button onClick={submitReview} disabled={rating === 0}>
                                    Publier l'avis
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
      <Footer />
    </div>
  )
}
