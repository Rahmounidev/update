"use client"

import { useState } from "react"
import { ArrowLeft, Minus, Plus, Trash2, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import Image from "next/image"
import Footer from "@/components/footer"

// Mock data pour le panier
const initialCartItems = [
  {
    id: 1,
    name: "Pizza Margherita",
    restaurant: "Pizza Palace",
    price: 159,
    quantity: 2,
    options: "Grande, Pâte fine",
    extras: "Olives, Champignons",
    specialInstructions: "Bien cuite",
  },
  {
    id: 2,
    name: "Spaghetti Carbonara",
    restaurant: "Pizza Palace",
    price: 135,
    quantity: 1,
    options: "Portion normale",
    extras: "Parmesan supplémentaire",
    specialInstructions: "",
  },
]

export default function CartPage() {
  const [cartItems, setCartItems] = useState(initialCartItems)
  const [promoCode, setPromoCode] = useState("")
  const [discount, setDiscount] = useState(0)

  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity === 0) {
      setCartItems(cartItems.filter((item) => item.id !== id))
    } else {
      setCartItems(cartItems.map((item) => (item.id === id ? { ...item, quantity: newQuantity } : item)))
    }
  }

  const removeItem = (id: number) => {
    setCartItems(cartItems.filter((item) => item.id !== id))
  }

  const applyPromoCode = () => {
    // Logique pour appliquer le code promo
    if (promoCode === "WELCOME10") {
      setDiscount(0.1) // 10% de réduction
    }
  }

  const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
  const discountAmount = subtotal * discount
  const deliveryFee = 25
  const total = subtotal - discountAmount + deliveryFee

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-4">
                <Link href="/">
                  <Button variant="ghost" size="sm">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Retour
                  </Button>
                </Link>
                <Image src="/images/droovo-logo.png" alt="Droovo" width={120} height={40} className="h-8 w-auto" />
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-2xl mx-auto px-4 py-16 text-center">
          <ShoppingCart className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Votre panier est vide</h2>
          <p className="text-gray-600 mb-8">Ajoutez des plats délicieux à votre panier pour commencer</p>
          <Link href="/">
            <Button>Découvrir les restaurants</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Retour
                </Button>
              </Link>
              <Image src="/images/droovo-logo.png" alt="Droovo" width={120} height={40} className="h-8 w-auto" />
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Votre commande ({cartItems.length} articles)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {cartItems.map((item, index) => (
                  <div key={item.id}>
                    <div className="flex items-start space-x-4">
                      <div className="flex-1">
                        <h3 className="font-medium">{item.name}</h3>
                        <p className="text-sm text-gray-600">{item.restaurant}</p>
                        {item.options && <p className="text-sm text-gray-500">Options: {item.options}</p>}
                        {item.extras && <p className="text-sm text-gray-500">Suppléments: {item.extras}</p>}
                        {item.specialInstructions && (
                          <p className="text-sm text-gray-500">Instructions: {item.specialInstructions}</p>
                        )}
                      </div>

                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm" onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <Button variant="outline" size="sm" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="text-right">
                        <p className="font-medium">{(item.price * item.quantity).toFixed(2)} DH</p>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem(item.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    {index < cartItems.length - 1 && <Separator className="mt-4" />}
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Promo Code */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Code promo</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-2">
                  <Input
                    placeholder="Entrez votre code promo"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                  />
                  <Button onClick={applyPromoCode} variant="outline">
                    Appliquer
                  </Button>
                </div>
                {discount > 0 && (
                  <p className="text-green-600 text-sm mt-2">Code promo appliqué ! Réduction de {discount * 100}%</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Récapitulatif</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Sous-total</span>
                  <span>{subtotal.toFixed(2)} DH</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Réduction ({discount * 100}%)</span>
                    <span>-{discountAmount.toFixed(2)} DH</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Frais de service</span>
                  <span>{deliveryFee.toFixed(2)} DH</span>
                </div>

                <Separator />

                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>{total.toFixed(2)} DH</span>
                </div>

                <Link href="/checkout" className="w-full">
                  <Button className="w-full" size="lg">
                    Passer la commande
                  </Button>
                </Link>

                <p className="text-xs text-gray-500 text-center">
                  En passant commande, vous acceptez nos conditions d'utilisation
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
