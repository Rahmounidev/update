"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { ArrowLeft, CreditCard, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import Image from "next/image";
import Footer from "@/components/footer";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  restaurant: string;
}

export default function CheckoutPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [deliveryMethod, setDeliveryMethod] = useState("delivery");
  const [loading, setLoading] = useState(false);

  const [orderData, setOrderData] = useState({
    address: "",
    city: "",
    postalCode: "",
    phone: "",
    deliveryInstructions: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardName: "",
    billingAddress: "",
    billingCity: "",
    billingPostalCode: "",
  });

  
  const checkSession = async () => {
    try {
      const res = await fetch("/api/session", { credentials: "include" });
      if (!res.ok) return null;
      const data = await res.json();
      console.log("SESSION RESPONSE:", data);
      return data?.id || data?.email ? data : null;
    } catch (err) {
      console.error("Erreur checkSession:", err);
      return null;
    }
  };

  
  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      setCartItems(JSON.parse(storedCart));
    }
  }, []);

 
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = deliveryMethod === "delivery" ? 2.5 : 0;
  const total = subtotal + deliveryFee;

 
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (cartItems.length === 0) {
      alert("Votre panier est vide");
      return;
    }

    const session = await checkSession();
    if (!session) {
      alert("Veuillez vous connecter pour finaliser votre commande.");
      window.location.href = "/login";
      return;
    }

    try {
      setLoading(true);

     
      const deliveryAddress =
        deliveryMethod === "delivery"
          ? `${orderData.address}, ${orderData.city} ${orderData.postalCode}`
          : "Retrait en magasin";

      const orderPayload = {
        items: cartItems.map((item) => ({
          dishId: item.id,
          quantity: item.quantity,
          notes: "", 
        })),
        deliveryAddress,
        notes: orderData.deliveryInstructions,
        paymentMethod: paymentMethod.toUpperCase(),
      };

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(orderPayload),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("Erreur API:", data);
        throw new Error(data.message || "Erreur lors de la création de la commande.");
      }

      console.log("Commande créée:", data.order);

      
      localStorage.removeItem("cart");

      window.location.href = "/orders";
    } catch (error: any) {
      console.error("Erreur handleSubmit:", error);
      alert(error.message || "Impossible de finaliser la commande.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/cart">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Retour au panier
                </Button>
              </Link>
              <Image src="/droovo-logo.png" alt="Droovo" width={120} height={40} className="h-8 w-auto" />
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MapPin className="h-5 w-5 mr-2" />
                    Mode de livraison
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup value={deliveryMethod} onValueChange={setDeliveryMethod}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="delivery" id="delivery" />
                      <Label htmlFor="delivery">Livraison à domicile (+2.50DH)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="pickup" id="pickup" />
                      <Label htmlFor="pickup">À emporter (gratuit)</Label>
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>

              
              {deliveryMethod === "delivery" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Adresse de livraison</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="address">Adresse complète</Label>
                      <Input
                        id="address"
                        placeholder="123 Boulevard Mohammed V"
                        value={orderData.address}
                        onChange={(e) => setOrderData({ ...orderData, address: e.target.value })}
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="city">Ville</Label>
                        <Input
                          id="city"
                          placeholder="Casablanca"
                          value={orderData.city}
                          onChange={(e) => setOrderData({ ...orderData, city: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="postalCode">Code postal</Label>
                        <Input
                          id="postalCode"
                          placeholder="20000"
                          value={orderData.postalCode}
                          onChange={(e) => setOrderData({ ...orderData, postalCode: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Téléphone</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+212 6 12 34 56 78"
                        value={orderData.phone}
                        onChange={(e) => setOrderData({ ...orderData, phone: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="deliveryInstructions">Instructions de livraison (optionnel)</Label>
                      <Textarea
                        id="deliveryInstructions"
                        placeholder="Étage, code d'accès, instructions spéciales..."
                        value={orderData.deliveryInstructions}
                        onChange={(e) => setOrderData({ ...orderData, deliveryInstructions: e.target.value })}
                      />
                    </div>
                  </CardContent>
                </Card>
              )}

              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CreditCard className="h-5 w-5 mr-2" />
                    Mode de paiement
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs value={paymentMethod} onValueChange={setPaymentMethod}>
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="card">Carte bancaire</TabsTrigger>
                      <TabsTrigger value="paypal">PayPal</TabsTrigger>
                      <TabsTrigger value="cash">Espèces</TabsTrigger>
                    </TabsList>

                    <TabsContent value="card" className="space-y-4 mt-4">
                      <div className="space-y-2">
                        <Label htmlFor="cardNumber">Numéro de carte</Label>
                        <Input
                          id="cardNumber"
                          placeholder="1234 5678 9012 3456"
                          value={orderData.cardNumber}
                          onChange={(e) => setOrderData({ ...orderData, cardNumber: e.target.value })}
                          required
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="expiryDate">Date d'expiration</Label>
                          <Input
                            id="expiryDate"
                            placeholder="MM/AA"
                            value={orderData.expiryDate}
                            onChange={(e) => setOrderData({ ...orderData, expiryDate: e.target.value })}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="cvv">CVV</Label>
                          <Input
                            id="cvv"
                            placeholder="123"
                            value={orderData.cvv}
                            onChange={(e) => setOrderData({ ...orderData, cvv: e.target.value })}
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cardName">Nom sur la carte</Label>
                        <Input
                          id="cardName"
                          placeholder="Jean Dupont"
                          value={orderData.cardName}
                          onChange={(e) => setOrderData({ ...orderData, cardName: e.target.value })}
                          required
                        />
                      </div>
                    </TabsContent>

                    <TabsContent value="paypal" className="mt-4">
                      <p className="text-gray-600">Vous serez redirigé vers PayPal pour finaliser votre paiement.</p>
                    </TabsContent>

                    <TabsContent value="cash" className="mt-4">
                      <p className="text-gray-600">
                        {deliveryMethod === "delivery"
                          ? "Paiement en espèces à la livraison."
                          : "Paiement en espèces au retrait de la commande."}
                      </p>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>

              <Button type="submit" className="w-full" size="lg" disabled={loading}>
                {loading ? "Traitement..." : `Confirmer la commande - ${total.toFixed(2)} DH`}
              </Button>
            </form>
          </div>

          
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Récapitulatif de commande</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {cartItems.length === 0 ? (
                    <p className="text-gray-500">Votre panier est vide.</p>
                  ) : (
                    cartItems.map((item) => (
                      <div key={item.id} className="flex justify-between">
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-gray-600">Quantité: {item.quantity}</p>
                        </div>
                        <span>{(item.price * item.quantity).toFixed(2)} DH</span>
                      </div>
                    ))
                  )}
                </div>

                <Separator />

                <div className="flex justify-between">
                  <span>Sous-total</span>
                  <span>{subtotal.toFixed(2)} DH</span>
                </div>

                {deliveryMethod === "delivery" && (
                  <div className="flex justify-between">
                    <span>Frais de livraison</span>
                    <span>{deliveryFee.toFixed(2)} DH</span>
                  </div>
                )}

                <Separator />

                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>{total.toFixed(2)} DH</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
