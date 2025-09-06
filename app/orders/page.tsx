"use client"

import { useState, useEffect } from "react"
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

type OrderItem = {
  dishes: { name: string; image?: string }
  quantity: number
  price: number
}

type Order = {
  id: string
  orderNumber: string
  status: string
  totalAmount: number
  deliveryAddress: string
  createdAt: string
  users: {
    restaurantName: string;
    name: string;
    logo?: string;
    phone?: string;
  };
    order_items: OrderItem[]
  review?: { rating: number; comment?: string } | null 
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case "PENDING":
      return <Badge variant="secondary">En attente</Badge>
    case "CONFIRMED":
      return <Badge variant="default">Confirmée</Badge>
    case "PREPARING":
      return <Badge variant="default" className="bg-orange-500">En préparation</Badge>
    case "READY":
      return <Badge variant="default" className="bg-blue-500">Prête</Badge>
    case "DELIVERED":
      return <Badge variant="default" className="bg-green-500">Livrée</Badge>
    case "CANCELLED":
      return <Badge variant="destructive">Annulée</Badge>
    default:
      return <Badge variant="secondary">{status}</Badge>
  }
}

const getStatusMessage = (status: string) => {
  switch (status) {
    case "PENDING":
      return "Votre commande est en attente de confirmation"
    case "CONFIRMED":
      return "Votre commande a été confirmée par le restaurant"
    case "PREPARING":
      return "Votre commande est en cours de préparation"
    case "READY":
      return "Votre commande est prête pour la livraison/le retrait"
    case "DELIVERED":
      return "Votre commande a été livrée avec succès"
    case "CANCELLED":
      return "Votre commande a été annulée"
    default:
      return "Statut inconnu"
  }
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [rating, setRating] = useState(0)
  const [review, setReview] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const fetchOrders = async () => {
    try {
      setLoading(true)
      setError(null)

      const res = await fetch("/api/orders", { credentials: "include" })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.message || "Erreur lors de la récupération des commandes")
      }
      const data = await res.json()
      setOrders(data.orders || [])
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  const activeOrders = orders.filter(o => o.status !== "DELIVERED" && o.status !== "CANCELLED")
  const pastOrders = orders.filter(o => o.status === "DELIVERED" || o.status === "CANCELLED")

  
  async function submitReview() {
    if (!selectedOrder) return
    if (rating < 1 || rating > 5) {
      alert("Veuillez sélectionner une note entre 1 et 5 étoiles.")
      return
    }
    setSubmitting(true)
    try {
      const res = await fetch(`/api/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: selectedOrder.id,
          rating,
          comment: review
        }),
        credentials: "include",
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || "Erreur lors de l'envoi de l'avis")


      setOrders((prev) =>
        prev.map((o) =>
          o.id === selectedOrder.id ? { ...o, review: { rating, comment: review } } : o
        )
      )
      setSelectedOrder(null)
      setRating(0)
      setReview("")
      alert("Merci pour votre avis !")
    } catch (error: any) {
      alert(error.message || "Erreur lors de l'envoi de l'avis")
    } finally {
      setSubmitting(false)
    }
  }

 
  const StarRating = ({
    rating,
    setRating,
  }: {
    rating: number
    setRating: (r: number) => void
  }) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`cursor-pointer ${star <= rating ? "text-yellow-400" : "text-gray-300"}`}
            onClick={() => setRating(star)}
          />
        ))}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ModernHeader cartItemsCount={0} userLocation="Casablanca, Maroc" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Mes commandes</h2>

        {loading ? (
          <p className="text-center text-gray-600">Chargement des commandes...</p>
        ) : error ? (
          <Card>
            <CardContent className="text-center py-12">
              <h3 className="text-lg font-medium text-red-600 mb-2">Erreur</h3>
              <p className="text-gray-600 mb-6">{error}</p>
              <Button onClick={fetchOrders}>Réessayer</Button>
            </CardContent>
          </Card>
        ) : (
          <Tabs defaultValue="active" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="active">Commandes en cours ({activeOrders.length})</TabsTrigger>
              <TabsTrigger value="past">Historique ({pastOrders.length})</TabsTrigger>
            </TabsList>

            {/* Commandes en cours */}
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
                              <span>{order.users.restaurantName}</span>
                              {getStatusBadge(order.status)}
                            </CardTitle>
                            <CardDescription>
                              Commande #{order.orderNumber} • {new Date(order.createdAt).toLocaleDateString()}
                            </CardDescription>
                          </div>
                          <div className="text-right">
                          <p className="text-lg font-bold">
  {(typeof order.totalAmount === "number" ? order.totalAmount : Number(order.totalAmount) || 0).toFixed(2)} DH
</p>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="bg-blue-50 p-4 rounded-lg">
                            <p className="text-blue-800 font-medium">{getStatusMessage(order.status)}</p>
                          </div>
                          <div>
                            <h4 className="font-medium mb-2">Articles commandés:</h4>
                            <div className="space-y-1">
                              {order.order_items.map((item, idx) => (
                                <div key={idx} className="flex justify-between text-sm">
                                  <span>{item.quantity}x {item.dishes.name}</span>
                                  <span>{(typeof item.price === "number" ? item.price : Number(item.price) || 0).toFixed(2)} DH</span>
                                  </div>
                              ))}
                            </div>
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <MapPin className="h-4 w-4 mr-1" />
                            <span>{order.deliveryAddress}</span>
                          </div>
                          <div className="flex space-x-2">
                          <Button
    variant="outline"
    size="sm"
    onClick={() => {
      if (order.users.phone) {
        window.location.href = `tel:${order.users.phone}`;
      } else {
        alert("Numéro de téléphone du restaurant non disponible");
      }
    }}
  >
    <Phone className="h-4 w-4 mr-1" />
    Contacter le restaurant
  </Button>

  {/* Bouton pour contacter le support via WhatsApp */}
  <Button
    variant="outline"
    size="sm"
    onClick={() => {
      if (order.users.phone) {
        const text = encodeURIComponent("Bonjour, j'ai besoin d'aide avec ma commande");
        window.open(`https://wa.me/${order.users.phone}?text=${text}`, "_blank");
      } else {
        alert("Numéro WhatsApp du support non disponible");
      }
    }}
  >
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

            {/* Historique */}
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
                              <span>{order.users.restaurantName}</span>
                              {getStatusBadge(order.status)}
                              {order.review?.rating ? (
                                <div className="flex items-center ml-4 text-yellow-400">
                                  {[...Array(order.review.rating)].map((_, i) => (
                                    <Star key={i} className="h-5 w-5" />
                                  ))}
                                </div>
                              ) : null}
                            </CardTitle>
                            <CardDescription>
                              Commande #{order.orderNumber} • {new Date(order.createdAt).toLocaleDateString()}
                            </CardDescription>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold">{order.totalAmount.toFixed(2)} DH</p>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-medium mb-2">Articles commandés:</h4>
                            <div className="space-y-1">
                              {order.order_items.map((item, idx) => (
                                <div key={idx} className="flex justify-between text-sm">
                                  <span>{item.quantity}x {item.dishes.name}</span>
                                  <span>{item.price.toFixed(2)} DH</span>
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          {order.status === "DELIVERED" && !order.review?.rating && (
                            <div className="mt-4">
                              <Dialog open={selectedOrder?.id === order.id} onOpenChange={(open) => !open && setSelectedOrder(null)}>
                                <DialogTrigger asChild>
                                  <Button onClick={() => setSelectedOrder(order)}>Laisser un avis</Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-lg">
                                  <DialogHeader>
                                    <DialogTitle>Laisser un avis pour {order.users.restaurantName}</DialogTitle>
                                    <DialogDescription>
                                      Merci de noter votre expérience et laisser un commentaire optionnel.
                                    </DialogDescription>
                                  </DialogHeader>
                                  <div className="mt-4">
                                    <Label>Note</Label>
                                    <StarRating rating={rating} setRating={setRating} />
                                  </div>
                                  <div className="mt-4">
                                    <Label>Commentaire</Label>
                                    <Textarea
                                      value={review}
                                      onChange={(e) => setReview(e.target.value)}
                                      placeholder="Votre commentaire (optionnel)"
                                    />
                                  </div>
                                  <DialogFooter>
                                    <Button variant="outline" onClick={() => setSelectedOrder(null)} disabled={submitting}>Annuler</Button>
                                    <Button onClick={submitReview} disabled={submitting}>
                                      {submitting ? "Envoi..." : "Envoyer"}
                                    </Button>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}
      </div>
      <Footer />
    </div>
  )
}
